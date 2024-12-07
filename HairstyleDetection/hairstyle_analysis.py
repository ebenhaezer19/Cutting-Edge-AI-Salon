import sqlite3
import os

def reset_and_create_database():
    # Hapus database lama jika ada
    if os.path.exists('hairstyles.db'):
        os.remove('hairstyles.db')
        print("Database lama telah dihapus.")
    
    # Buat koneksi baru ke database
    conn = sqlite3.connect('hairstyles.db')
    c = conn.cursor()
    
    # Buat tabel baru
    c.execute('''
        CREATE TABLE hairstyles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            face_shape TEXT NOT NULL,
            description TEXT NOT NULL
        )
    ''')
    
    # Data gaya rambut untuk berbagai bentuk wajah
    hairstyles_data = [
        # Bentuk Wajah Bulat
        ('Long Layered Cut', 'Bulat', 'Potongan rambut panjang berlapis yang membingkai wajah, menciptakan ilusi wajah lebih ramping dan panjang'),
        ('Deep Side Part', 'Bulat', 'Belahan rambut samping dalam yang memberikan efek asimetris, membantu memanjangkan wajah'),
        ('Textured Pixie', 'Bulat', 'Potongan pixie dengan tekstur di bagian atas untuk menambah tinggi dan mengurangi kesan bulat'),
        ('Long Bob (Lob)', 'Bulat', 'Potongan bob panjang sebahu dengan layer ringan yang memberi kesan memanjangkan wajah'),
        ('Side-Swept Bangs', 'Bulat', 'Poni menyamping yang lembut untuk membantu menyeimbangkan fitur wajah bulat'),
        
        # Bentuk Wajah Oval
        ('Classic Bob', 'Oval', 'Potongan bob klasik yang jatuh tepat di bawah dagu, sempurna untuk wajah oval'),
        ('Straight Bangs', 'Oval', 'Poni lurus yang memotong dahi, cocok untuk proporsi wajah oval yang seimbang'),
        ('Shoulder Length Waves', 'Oval', 'Rambut bergelombang sebahu yang membingkai wajah dengan lembut'),
        ('Layered Shag', 'Oval', 'Potongan shaggy berlapis yang memberikan tekstur dan volume'),
        ('Sleek Straight', 'Oval', 'Rambut lurus panjang yang halus, menonjolkan simetri wajah oval'),
        
        # Bentuk Wajah Kotak
        ('Soft Layers', 'Kotak', 'Layer lembut yang membantu melunakkan garis rahang yang tegas'),
        ('Side-Swept Pixie', 'Kotak', 'Pixie cut dengan poni menyamping untuk melunakkan sudut wajah'),
        ('Tousled Waves', 'Kotak', 'Gelombang acak yang menciptakan kesan lembut pada fitur wajah yang tegas'),
        ('Long Layers with Bangs', 'Kotak', 'Rambut panjang berlapis dengan poni samping yang melunakkan garis wajah'),
        ('Textured Bob', 'Kotak', 'Bob bertekstur yang membantu menyeimbangkan struktur wajah yang kuat'),
        
        # Bentuk Wajah Heart
        ('Chin-Length Bob', 'Heart', 'Potongan bob sebahu yang membantu menyeimbangkan dagu yang tegas'),
        ('Side-Swept Bangs', 'Heart', 'Poni menyamping yang membantu mengalihkan perhatian dari dagu yang tegas'),
        ('Long Layers', 'Heart', 'Rambut panjang berlapis yang membantu mengalihkan perhatian dari dagu'),
        ('Pixie Cut', 'Heart', 'Potongan pixie yang membantu menyeimbangkan fitur wajah yang tegas'),
        ('Asymmetrical Style', 'Heart', 'Gaya asimetris yang membantu mengalihkan perhatian dari dagu'),
        
        # Bentuk Wajah Oblong
        ('Long Layers', 'Oblong', 'Rambut panjang berlapis yang membantu mengisi ruang di samping wajah'),
        ('Side-Swept Bangs', 'Oblong', 'Poni menyamping yang membantu mengisi ruang di samping wajah'),
        ('Chin-Length Bob', 'Oblong', 'Potongan bob sebahu yang membantu mengisi ruang di samping wajah'),
        ('Pixie Cut', 'Oblong', 'Potongan pixie yang membantu mengisi ruang di samping wajah'),
        ('Asymmetrical Style', 'Oblong', 'Gaya asimetris yang membantu mengisi ruang di samping wajah'),
        
        # Bentuk Wajah Round
        ('Long Layers', 'Round', 'Rambut panjang berlapis yang membantu mengurangi kesan bulat'),
        ('Side-Swept Bangs', 'Round', 'Poni menyamping yang membantu mengurangi kesan bulat'),
        ('Chin-Length Bob', 'Round', 'Potongan bob sebahu yang membantu mengurangi kesan bulat'),
        ('Pixie Cut', 'Round', 'Potongan pixie yang membantu mengurangi kesan bulat'),
        ('Asymmetrical Style', 'Round', 'Gaya asimetris yang membantu mengurangi kesan bulat'),
        
        # Bentuk Wajah Square
        ('Soft Layers', 'Square', 'Layer lembut yang membantu melunakkan garis rahang yang tegas'),
        ('Side-Swept Pixie', 'Square', 'Pixie cut dengan poni menyamping untuk melunakkan sudut wajah'),
        ('Tousled Waves', 'Square', 'Gelombang acak yang menciptakan kesan lembut pada fitur wajah yang tegas'),
        ('Long Layers with Bangs', 'Square', 'Rambut panjang berlapis dengan poni samping yang melunakkan garis wajah'),
        ('Textured Bob', 'Square', 'Bob bertekstur yang membantu menyeimbangkan struktur wajah yang kuat')
    ]
    
    # Masukkan data ke dalam tabel
    c.executemany('INSERT INTO hairstyles (name, face_shape, description) VALUES (?, ?, ?)', hairstyles_data)
    
    # Commit perubahan dan tutup koneksi
    conn.commit()
    conn.close()
    
    print("Database baru telah dibuat dengan sukses!")
    
    # Verifikasi data yang telah dimasukkan
    conn = sqlite3.connect('hairstyles.db')
    c = conn.cursor()
    
    print("\nVerifikasi data yang telah dimasukkan:")
    print("\nBentuk Wajah Bulat:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Bulat'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Oval:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Oval'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Kotak:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Kotak'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Heart:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Heart'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Oblong:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Oblong'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Round:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Round'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
        
    print("\nBentuk Wajah Square:")
    c.execute("SELECT * FROM hairstyles WHERE face_shape='Square'")
    for row in c.fetchall():
        print(f"- {row[1]}: {row[3]}")
    
    conn.close()

if __name__ == "__main__":
    reset_and_create_database()