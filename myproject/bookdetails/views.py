from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import Bookdetails,Review

from django.db.models import Q 
from .models import Book,Purchase,Wishlist
import qrcode
from io import BytesIO
from django.conf import settings
from io import BytesIO
import base64
from django.http import JsonResponse;



def index(request):
   
    results = Bookdetails.objects.all().prefetch_related('reviews')
    if request.method == 'POST':
        search = request.POST.get('search')
        print(search)     
        if search:
            results = Bookdetails.objects.filter(
            Q(book_title__icontains=search) | 
            Q(book_name__icontains=search) | 
            Q(book_desc__icontains=search)
        ).prefetch_related('reviews')
        else:
            results = Bookdetails.objects.all().prefetch_related('reviews')  # Optionally, return all books if no search term is provided
         
    print(results)    
    return render(request, "index.html", {'bookdata': results})


def login_view(request):

    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, 'Login successful!')
                return redirect('home')  # Redirect to the homepage or another view
            else:
                signup_form = UserCreationForm()  
                return render(request, 'signup.html', {'form': signup_form, 'error': 'Invalid credentials. Please sign up.'})
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})
              
    
def signup_view(request):
    message = ''
    if request.method == 'POST':
        username = request.POST.get('username') 
        password = request.POST.get('password')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        User = get_user_model()
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists. Please choose a different one.')
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email is already registered. Please use a different one.')
        else:
            auth_user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                is_superuser=False
            )
            auth_user.set_password(password)
            auth_user.save()
            message = 'User registered successfully!'
            messages.success(request, 'Registration successful!')
    
    return render(request, 'signup.html', {'message': message})

def buybook(request, book_id):

    book = Bookdetails.objects.get(book_id=book_id)
    price = book.book_price  # Get the price for later use
    print(price)
    # Your UPI ID
    upi_id = "aashupandit69722@okaxis"

    # Create the UPI URI for the payment
    upi_uri = f"upi://pay?pa={upi_id}&pn=Aashu%20Pandit&am={price}&cu=INR"

    # Generate the QR Code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_uri)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)

    # Encode the image to base64
    qr_code_data = base64.b64encode(buffer.getvalue()).decode()

    return render(request, 'buybook.html', {'qr_code_data': qr_code_data, 'amount': price})


def savereview(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        rating = request.POST.get('rating')
        comment = request.POST.get('review')
        user_id = request.user.id
        if not user_id:
            return redirect('login')   
        # Validate input (optional)
        if book_id and rating and comment:
            # Create or update the review for the book
            #book = Book.objects.get(id=book_id)  # Ensure to use the correct field for your ID
            Review.objects.create(book_id=book_id, rating=rating, comment=comment, user_id=user_id)
            # Return a success response
            
            return JsonResponse({'success': True})

        return JsonResponse({'success': False, 'error': 'Invalid data'}, status=400)
    #return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
def loadReviews(request, book_id):
    
    book =  get_object_or_404(Bookdetails, book_id=book_id)
    
    reviews = Review.objects.filter(book=book).values('user__username', 'rating', 'comment', 'created_at')
    reviews_list = list(reviews)  # Convert the queryset to a list of dictionaries
    
    
    return JsonResponse({'reviews': reviews_list})
    #return render(request,'index.html')


def add_to_wishlist(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')  # Get the book_id from POST request
        if book_id:
            # Fetch the book by the provided ID
            book = get_object_or_404(Bookdetails, book_id=book_id)

            # Try to get or create the wishlist entry
            wishlist, created = Wishlist.objects.get_or_create(user=request.user, book=book)
            action = 'added' if created else 'removed'
            
            if not created:  # If the item was already in the wishlist, remove it
                wishlist.delete()
                action = 'removed'
            wishlist_items = Wishlist.objects.filter(user=request.user)
            bookdetails = [{'id': item.book.book_id, 'title': item.book.book_title,
                        'desc': item.book.book_desc, 'price': item.book.book_price,
                        'picture': item.book.book_picture.url} for item in wishlist_items]    

            # Return the action performed (added/removed) as a JSON response
            return JsonResponse({'action': action, 'bookdetails': bookdetails})

    return JsonResponse({'error': 'Invalid request'}, status=400)

def wishlist_view(request):
    print(request.user.id)
    
    wishlist_items = Wishlist.objects.filter(user_id=request.user.id)
    total_books = wishlist_items.count()
     # Query wishlist items related to the user
    bookdetails = [item.book for item in wishlist_items] 
    return render(request, 'wishlist.html', {
        'bookdetails': bookdetails,
        'total_books': total_books
    })
def remove_from_wishlist(request, book_id):
    if request.method == 'POST':
        # Assuming you have a Wishlist model related to the user and book
        wishlist_item = get_object_or_404(Wishlist, user=request.user, book_id=book_id)
        wishlist_item.delete()  # Remove the item from the wishlist
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=400)

def logout_view(request):
    logout(request)  # Log out the user
    messages.success(request, 'You have been logged out successfully.')  # Add a success message
    return redirect('home')  # Redirect to the homepage after logging outhe user

    
    return render(request, 'search_results.html', {'results': results}) 


   