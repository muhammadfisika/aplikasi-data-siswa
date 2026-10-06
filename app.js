// ==========================================
// APLIKASI DATA SISWA
// TAHAP 3
// FIREBASE FIRESTORE
// ==========================================


// ==========================================
// FIREBASE SDK
// ==========================================

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


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


// ==========================================
// FIREBASE CONFIGURATION
// GANTI DENGAN CONFIG MILIK ANDA
// ==========================================

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyCttNZL1gypyuKfg_vigXo0qIkER3EYKt4",
  authDomain: "aplikasi-data-siswa-d6055.firebaseapp.com",
  projectId: "aplikasi-data-siswa-d6055",
  storageBucket: "aplikasi-data-siswa-d6055.firebasestorage.app",
  messagingSenderId: "174161734101",
  appId: "1:174161734101:web:2e0073cd25a5a65fe0b55c"
};
const app = initializeApp(firebaseConfig);

// ==========================================
// INISIALISASI FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


// ==========================================
// INISIALISASI FIRESTORE
// ==========================================

const db = getFirestore(app);


// ==========================================
// REFERENSI COLLECTION
// ==========================================

const siswaCollection =
  collection(db, "siswa");


// ==========================================
// ELEMEN HTML
// ==========================================

const formSiswa =
  document.getElementById("formSiswa");

const searchInput =
  document.getElementById("searchInput");

const tabelSiswa =
  document.getElementById("tabelSiswa");


// ==========================================
// VARIABEL DATA
// ==========================================

let dataSiswa = [];


// ==========================================
// LOAD DATA SAAT APLIKASI DIBUKA
// ==========================================

window.addEventListener(
  "DOMContentLoaded",
  function() {

    tampilkanDataSiswa();

  }
);


// ==========================================
// TAMBAH DATA SISWA
// ==========================================

formSiswa.addEventListener(
  "submit",
  async function(event) {

    event.preventDefault();


    const nisn =
      document
        .getElementById("nisn")
        .value
        .trim();


    const nama =
      document
        .getElementById("nama")
        .value
        .trim();


    const kelas =
      document
        .getElementById("kelas")
        .value;


    // Validasi

    if (!nisn || !nama || !kelas) {

      alert(
        "Semua data harus diisi."
      );

      return;
    }


    try {

      // Simpan ke Firestore

      await addDoc(
        siswaCollection,
        {

          nisn: nisn,

          nama: nama,

          kelas: kelas,

          createdAt:
            new Date()

        }
      );


      alert(
        "Data siswa berhasil disimpan ke Firebase."
      );


      // Kosongkan form

      formSiswa.reset();


      // Ambil ulang data

      await tampilkanDataSiswa();


    } catch (error) {

      console.error(error);

      alert(
        "Gagal menyimpan data: " +
        error.message
      );

    }

  }
);


// ==========================================
// AMBIL DATA DARI FIRESTORE
// ==========================================

async function tampilkanDataSiswa() {

  try {

    tabelSiswa.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="empty"
        >
          Memuat data...
        </td>

      </tr>

    `;


    // Query data siswa

    const q = query(
      siswaCollection,
      orderBy("nama")
    );


    const snapshot =
      await getDocs(q);


    dataSiswa = [];


    snapshot.forEach(
      function(docSnapshot) {

        const data =
          docSnapshot.data();


        dataSiswa.push({

          id: docSnapshot.id,

          nisn: data.nisn || "",

          nama: data.nama || "",

          kelas: data.kelas || ""

        });

      }
    );


    tampilkanTabel(dataSiswa);


  } catch (error) {

    console.error(error);

    tabelSiswa.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="empty"
        >
          Gagal mengambil data.
        </td>

      </tr>

    `;


    alert(
      "Gagal mengambil data Firebase: " +
      error.message
    );

  }

}


// ==========================================
// TAMPILKAN DATA KE TABEL
// ==========================================

function tampilkanTabel(data) {

  tabelSiswa.innerHTML = "";


  if (data.length === 0) {

    tabelSiswa.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="empty"
        >
          Belum ada data siswa.
        </td>

      </tr>

    `;

    return;
  }


  data.forEach(
    function(siswa, index) {

      const row =
        document.createElement("tr");


      row.innerHTML = `

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
            onclick="hapusSiswa('${siswa.id}')"
          >
            Hapus
          </button>

        </td>

      `;


      tabelSiswa.appendChild(row);

    }
  );

}


// ==========================================
// HAPUS DATA
// ==========================================

window.hapusSiswa =
  async function(id) {

    const konfirmasi =
      confirm(
        "Apakah data siswa ini akan dihapus?"
      );


    if (!konfirmasi) {

      return;
    }


    try {

      await deleteDoc(
        doc(db, "siswa", id)
      );


      alert(
        "Data berhasil dihapus."
      );


      await tampilkanDataSiswa();


    } catch (error) {

      console.error(error);

      alert(
        "Gagal menghapus data: " +
        error.message
      );

    }

  };


// ==========================================
// PENCARIAN
// ==========================================

searchInput.addEventListener(
  "input",
  function() {

    const keyword =
      searchInput.value
        .toLowerCase()
        .trim();


    const hasil =
      dataSiswa.filter(
        function(siswa) {

          return (

            siswa.nama
              .toLowerCase()
              .includes(keyword)

            ||

            siswa.nisn
              .toLowerCase()
              .includes(keyword)

            ||

            siswa.kelas
              .toLowerCase()
              .includes(keyword)

          );

        }
      );


    tampilkanTabel(hasil);

  }
);


// ==========================================
// KEAMANAN TAMPILAN
// ==========================================

function escapeHTML(text) {

  return String(text)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


const CACHE_NAME = "data-siswa-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];


self.addEventListener("install", function(event) {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(function(cache) {

        return cache.addAll(
          FILES_TO_CACHE
        );

      })

  );

});


self.addEventListener("activate", function(event) {

  event.waitUntil(

    caches.keys()
      .then(function(cacheNames) {

        return Promise.all(

          cacheNames.map(
            function(cacheName) {

              if (
                cacheName !== CACHE_NAME
              ) {

                return caches.delete(
                  cacheName
                );

              }

            }
          )

        );

      })

  );

});


self.addEventListener("fetch", function(event) {

  event.respondWith(

    fetch(event.request)
      .catch(function() {

        return caches.match(
          event.request
        );

      })

  );

});
