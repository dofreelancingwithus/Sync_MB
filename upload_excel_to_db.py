import pandas as pd
import mysql.connector
from mysql.connector import Error

def clean_mood_value(mood):
    """Standardize mood values to lowercase and trim whitespace"""
    if pd.isna(mood):  # Handle NaN/None values
        return 'neutral'
    return str(mood).strip().lower()  # Convert to string first

def clean_string(value):
    """Safely clean string values"""
    if pd.isna(value):
        return ''
    return str(value).strip()

try:
    # Read CSV file
    df = pd.read_csv("songs.csv")  
    
    # Clean and standardize data
    df.rename(columns={
        'LINKS': 'link',
        'MOOD': 'mood',
        'TITLE ': 'title',
        'ARTIST': 'artist'
    }, inplace=True)
    
    # Clean all columns
    df['mood'] = df['mood'].apply(clean_mood_value)
    df['title'] = df['title'].apply(clean_string)
    df['artist'] = df['artist'].apply(clean_string).replace('', 'Unknown')
    df['link'] = df['link'].apply(clean_string)
    
    # MySQL connection
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Akash23112011',
        database='mood_playlist'
    )
    
    if conn.is_connected():
        cursor = conn.cursor()
        
        # Clear existing data
        cursor.execute("DELETE FROM song")
        
        # Insert data in batches (more efficient)
        insert_query = """
        INSERT INTO song (link, mood, title, artist)
        VALUES (%s, %s, %s, %s)
        """
        
        # Convert DataFrame to list of tuples
        data = [
            (row['link'], row['mood'], row['title'], row['artist'])
            for _, row in df.iterrows()
        ]
        
        cursor.executemany(insert_query, data)
        conn.commit()
        print(f"✅ Successfully inserted {len(df)} songs from CSV.")
        
except Error as e:
    print(f"Database error: {e}")
    if 'conn' in locals() and conn.is_connected():
        conn.rollback()
except FileNotFoundError:
    print("Error: CSV file not found. Please check the file path.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
    if 'conn' in locals() and conn.is_connected():
        conn.rollback()
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()