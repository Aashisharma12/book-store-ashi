from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    cat_id = models.CharField(max_length=50, primary_key=True)
    cat_name = models.CharField(max_length=50)

class Bookdetails(models.Model):
    book_id = models.AutoField( primary_key=True)
    book_title = models.CharField(max_length=50)
    book_name = models.CharField(max_length=50)
    book_desc = models.CharField(max_length=50)
    book_price = models.CharField(max_length=50)
    book_category = models.ForeignKey(Category, on_delete=models.CASCADE)
    book_picture = models.ImageField(upload_to='book_image/')

    class Meta:
        db_table='bookdetails_bookdetails'
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(reviews.aggregate(models.Avg('rating'))['rating__avg'], 2)
        return 0    

class Book(models.Model):
    
    title = models.CharField(max_length=255)
    barcode = models.CharField(max_length=13, unique=True)
    class Meta:
        db_table='bookdetails_book'
    
class Review(models.Model):
    book = models.ForeignKey(Bookdetails, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # Rating between 1 and 5
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table='bookdetails_review'
   

    def __str__(self):
        return f'Review for {self.book.book_title} by {self.user.username}'
class Wishlist(models.Model):
    book = models.ForeignKey(Bookdetails, on_delete=models.CASCADE, related_name='wishlist')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table='bookdetails_wishlist'
        unique_together = ('user', 'book')
    def __str__(self):
        return f"{self.user.username} - {self.book.book_title}"


class Purchase(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    purchase_date = models.DateTimeField(auto_now_add=True)    
    
    def __str__(self):
        return f'{self.book_title} - {self.book_id} - {self.book_price} INR'

