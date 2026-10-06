
// ======================================================
// APLIKASI DATA SISWA
// Firebase Firestore + GitHub Pages + PWA
// ======================================================

// ======================================================
// 1. IMPORT FIREBASE
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ======================================================
// 2. KONFIGURASI FIREBASE
// ======================================================
//
// GANTI bagian di bawah ini dengan konfigurasi Firebase
// milik project Anda.
//
// Firebase Console
// → Project Settings
// → Your apps
// → Web app
// → SDK setup and configuration
// → Config
// ======================================================

const firebaseConfig = {
  apiKey: "AIzaSyCttNZL1gypyuKfg_vigXo0qIkER3EYKt4",
  authDomain: "aplikasi-data-siswa-d6055.firebaseapp.com",
  projectId: "aplikasi-data-siswa-d6055",
  storageBucket: "aplikasi-data-siswa-d6055.firebasestorage.app",
  messagingSenderId: "174161734101",
  appId: "1:174161734101:web:2e0073cd25a5a65fe0b55c"
};


// ======================================================
// 3. INISIALISASI FIREBASE
// ======================================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ======================================================
// 4. REFERENSI COLLECTION FIRESTORE
// ======================================================

const siswaCollection = collection(db, "siswa");


// ======================================================
// 5. REFERENSI ELEMENT HTML
// ======================================================

const formSiswa = document.getElementById("formSiswa");

const inputNisn = document.getElementById("nisn");

const inputNama = document.getElementById("nama");

const inputKelas = document.getElementById("kelas");

const tabelSiswa = document.getElementById("tabelSiswa");

const inputCari = document.getElementById("cari");


// ======================================================
// 6. VARIABEL DATA SISWA
// ======================================================

let dataSiswa = [];


// ======================================================
// 7. ESCAPE HTML
// ======================================================
// Mencegah karakter HTML masuk langsung ke tabel.
// ======================================================

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


// ======================================================
// 8. MEMUAT DATA DARI FIRESTORE
// ======================================================

async function tampilkanDataSiswa() {

  try {

    tabelSiswa.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Memuat data...
        </td>
      </tr>
    `;

    const q = query(
      siswaCollection,
      orderBy("nama")
    );

    const snapshot = await getDocs(q);

    dataSiswa = [];

    snapshot.forEach((docSnapshot) => {

      const data = docSnapshot.data();

      dataSiswa.push({
        id: docSnapshot.id,
        nisn: data.nisn || "",
        nama: data.nama || "",
        kelas: data.kelas || ""
      });

    });

    tampilkanKeTabel(dataSiswa);

  } catch (error) {

    console.error("Gagal mengambil data Firebase:", error);

    tabelSiswa.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;color:red;">
          Gagal mengambil data Firebase.
          <br>
          ${escapeHTML(error.message)}
        </td>
      </tr>
    `;

  }

}


// ======================================================
// 9. MENAMPILKAN DATA KE TABEL
// ======================================================

function tampilkanKeTabel(data) {

  if (!data || data.length === 0) {

    tabelSiswa.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Belum ada data siswa.
        </td>
      </tr>
    `;

    return;
  }


  tabelSiswa.innerHTML = data.map((siswa, index) => {

    return `
      <tr>

        <td>
          ${index + 1}
        </td>

        <td>
          ${escapeHTML(siswa.nisn)}
        </td>

        <td>
          ${escapeHTML(siswa.nama)}
        </td>

        <td>
          ${escapeHTML(siswa.kelas)}
        </td>

        <td>

          <button
            type="button"
            class="btn-hapus"
            data-id="${escapeHTML(siswa.id)}">

            Hapus

          </button>

        </td>

      </tr>
    `;

  }).join("");


  // Pasang event tombol hapus
  document.querySelectorAll(".btn-hapus").forEach((button) => {

    button.addEventListener("click", function() {

      const id = this.getAttribute("data-id");

      hapusSiswa(id);

    });

  });

}


// ======================================================
// 10. MENAMBAHKAN DATA SISWA
// ======================================================

if (formSiswa) {

  formSiswa.addEventListener("submit", async function(event) {

    event.preventDefault();


    const nisn = inputNisn.value.trim();

    const nama = inputNama.value.trim();

    const kelas = inputKelas.value.trim();


    // Validasi
    if (!nisn || !nama || !kelas) {

      alert("Semua data siswa harus diisi.");

      return;

    }


    try {

      // Nonaktifkan tombol submit
      const tombolSimpan =
        formSiswa.querySelector('button[type="submit"]');

      if (tombolSimpan) {
        tombolSimpan.disabled = true;
        tombolSimpan.textContent = "Menyimpan...";
      }


      // Simpan ke Firestore
      await addDoc(siswaCollection, {

        nisn: nisn,

        nama: nama,

        kelas: kelas,

        createdAt: new Date()

      });


      alert("Data siswa berhasil disimpan.");


      // Kosongkan form
      formSiswa.reset();


      // Muat ulang data
      await tampilkanDataSiswa();


    } catch (error) {

      console.error("Gagal menyimpan data:", error);

      alert(
        "Gagal menyimpan data Firebase:\n" +
        error.message
      );


    } finally {

      const tombolSimpan =
        formSiswa.querySelector('button[type="submit"]');

      if (tombolSimpan) {

        tombolSimpan.disabled = false;

        tombolSimpan.textContent = "Simpan";

      }

    }

  });

}


// ======================================================
// 11. MENGHAPUS DATA SISWA
// ======================================================

async function hapusSiswa(id) {

  if (!id) {

    alert("ID data siswa tidak ditemukan.");

    return;

  }


  const konfirmasi = confirm(
    "Apakah Anda yakin ingin menghapus data siswa ini?"
  );


  if (!konfirmasi) {

    return;

  }


  try {

    await deleteDoc(
      doc(db, "siswa", id)
    );


    alert("Data siswa berhasil dihapus.");


    await tampilkanDataSiswa();


  } catch (error) {

    console.error("Gagal menghapus data:", error);

    alert(
      "Gagal menghapus data Firebase:\n" +
      error.message
    );

  }

}


// ======================================================
// 12. FITUR PENCARIAN
// ======================================================

if (inputCari) {

  inputCari.addEventListener("input", function() {

    const kataKunci =
      this.value
        .trim()
        .toLowerCase();


    if (!kataKunci) {

      tampilkanKeTabel(dataSiswa);

      return;

    }


    const hasil = dataSiswa.filter((siswa) => {

      const nisn =
        String(siswa.nisn || "").toLowerCase();

      const nama =
        String(siswa.nama || "").toLowerCase();

      const kelas =
        String(siswa.kelas || "").toLowerCase();


      return (
        nisn.includes(kataKunci) ||
        nama.includes(kataKunci) ||
        kelas.includes(kataKunci)
      );

    });


    tampilkanKeTabel(hasil);

  });

}


// ======================================================
// 13. LOAD DATA SAAT APLIKASI DIBUKA
// ======================================================

tampilkanDataSiswa();


// ======================================================
// 14. SERVICE WORKER / PWA
// ======================================================

if ("serviceWorker" in navigator) {

  window.addEventListener("load", function() {

    navigator.serviceWorker
      .register("./service-worker.js")

      .then(function(registration) {

        console.log(
          "Service Worker berhasil:",
          registration.scope
        );

      })

      .catch(function(error) {

        console.error(
          "Service Worker gagal:",
          error
        );

      });

  });

}


// ======================================================
// 15. INFORMASI DEBUG
// ======================================================

console.log(
  "Aplikasi Data Siswa berhasil dijalankan."
);

console.log(
  "Firebase Project:",
  firebaseConfig.projectId
);
