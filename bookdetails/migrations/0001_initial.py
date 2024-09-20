# Generated by Django 5.0.7 on 2024-08-12 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='bookdetails',
            fields=[
                ('book_id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('book_title', models.CharField(max_length=50)),
                ('book_name', models.CharField(max_length=50)),
                ('book_desc', models.CharField(max_length=50)),
                ('book_price', models.CharField(max_length=50)),
                ('book_category', models.CharField(max_length=50)),
            ],
        ),
    ]