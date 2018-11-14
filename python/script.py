# -*- coding: utf-8 -*-
"""
Created on Thu Nov  1 11:08:59 2018
@author: Monarch Mallick and Aman Kumar Gupta
"""

# Importing Libraries
import psycopg2
import numpy as np
import pandas as pd
import sys

# Connecting to Postgres Server and retrieving data
conn = psycopg2.connect(
    "postgres://jedysgnrdmbeml:c6f338dece3076829650f048297e584fb3196e667b772caea9d1fa9b01da7925@ec2-23-21-147-71.compute-1.amazonaws.com:5432/dts9qm174n3m")
cursor = conn.cursor()
cursor.execute("SELECT * FROM ratings;")
rows = cursor.fetchall()

# Data pre-processing and creating correlation matrix
data = pd.DataFrame(rows, columns=['user', 'book', 'rating'])
user_rating = pd.pivot_table(
    data=data, values='rating', index='user', columns='book')
correlation_matrix = user_rating.corr(method='pearson')

# Getting the ratings given by the user
userId = int(18)
cursor.execute("SELECT * FROM ratings WHERE user_id = 3;")
ratings = cursor.fetchall()

# Getting the book list
cursor.execute("SELECT id FROM books;")
books = cursor.fetchall()

# creating the book_correlation_values list
book_correlation_values = []
for book in books:
    i = book
    book_correlation_values.append([i[0], 0])

# Iterating on the ratings list and computing correlation value between the book and other books and then multipling it with the rating and adding into book_correlation_values list
for tup in ratings:
    user, book, rating = tup

    # getting the users who rated this particular book and making sure rating is not zero
    OneManOut_rating = user_rating[book]

    # finidng similarity using Pearson correlation
    similar_to_OneManOut = user_rating.corrwith(OneManOut_rating)
    corr_OneManOut = pd.DataFrame(similar_to_OneManOut, columns=['PearsonR'])
    corr_OneManOut.dropna(inplace=True)

    # getting the most similar book
    for i in range(0, len(book_correlation_values)):

        book_correlation_values[i][1] += corr_OneManOut.iloc[i][0] * rating

book_correlation_values_df = pd.DataFrame(book_correlation_values)
book_correlation_values_sorted = book_correlation_values_df.sort_values(
    1, ascending=False)
recommended_books = []
for i in range(0, len(book_correlation_values)):
    recommended_books.append(int(book_correlation_values_sorted.iloc[i][0]))
print(recommended_books)
sys.stdout.flush()
