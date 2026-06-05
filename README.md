# BCX Apps Catalog — GitHub Repo

Drag & drop file HTML ke folder `apps/` → `catalog.json` otomatis ter-generate.

## Struktur Repo

```
apps/
  kalkulator.html      ← file app kamu
  todo.html
  ...
scripts/
  generate-catalog.js  ← script generator (jangan diedit)
.github/workflows/
  generate-catalog.yml ← GitHub Actions (jangan diedit)
catalog.json           ← AUTO-GENERATED, jangan diedit manual
```

## Cara Pakai

1. Buka repo ini di GitHub
2. Masuk folder `apps/`
3. Klik **Add file → Upload files**
4. Drag & drop file `.html` app kamu
5. Klik **Commit changes**
6. Tunggu ~30 detik → `catalog.json` otomatis terupdate
7. ISIOS BCXApps langsung menampilkan app baru ✓

## Syarat File HTML

File HTML **harus** mengandung minimal `bcx:name`. Gunakan **BCX Meta Injector**
sebelum upload untuk menyuntikkan meta tag secara otomatis.

```html
<meta name="bcx:name"     content="Nama App">
<meta name="bcx:desc"     content="Deskripsi singkat.">
<meta name="bcx:category" content="useful">
<meta name="bcx:icon"     content="calculator">
<meta name="bcx:color"    content="from-blue-500 to-indigo-600">
<meta name="bcx:version"  content="1.0">
<meta name="bcx:author"   content="NamaDev">
```

### Field Tambahan (opsional)

| Meta Tag     | Keterangan                                  | Contoh                        |
|--------------|---------------------------------------------|-------------------------------|
| `bcx:tags`   | Badge di store (comma-separated)            | `baru, populer`               |
| `bcx:image`  | URL gambar preview/thumbnail                | `https://...` atau path relatif|
| `bcx:price`  | Harga (0 = gratis)                          | `0`                           |
| `bcx:id`     | ID unik override (default: nama file)       | `kalkulator-sains-v2`         |

## Setup ISIOS (satu kali)

Buka `js/apps/store.js` di ISIOS, cari baris ini dan isi URL catalog.json:

```js
EXTERNAL_CATALOG_URL: 'https://raw.githubusercontent.com/USERNAME/REPO/main/catalog.json',
```

Ganti `USERNAME/REPO` dengan username dan nama repo GitHub kamu.
