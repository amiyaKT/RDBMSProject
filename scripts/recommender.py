# -*- coding: utf-8 -*-
"""
Created on Thu Nov  1 11:08:59 2018
@author: Monarch Mallick and Aman Kumar Gupta
"""

#Importing Libraries
import psycopg2
import numpy as np
import pandas as pd

#Connecting to Postgres Server and retrieving data
conn = psycopg2.connect("postgres://jedysgnrdmbeml:c6f338dece3076829650f048297e584fb3196e667b772caea9d1fa9b01da7925@ec2-23-21-147-71.compute-1.amazonaws.com:5432/dts9qm174n3m")
cursor = conn.cursor()
cursor.execute("SELECT * FROM ratings;")
rows = cursor.fetchall()

#Data pre-processing and creating correlation matrix
data = pd.DataFrame(rows, columns=['user','book','rating'])
user_rating = pd.pivot_table(data = data, values = 'rating', index='user', columns='book')
correlation_matrix = user_rating.corr(method='pearson')