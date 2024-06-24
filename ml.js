// Sweet alert
function notif(judul, ikon, teks) {
    swal.fire({
        title: judul,
        text: teks,
        icon: ikon,
        timer: 3000,
        showConfirmButton: false
    });
}

const tabPrediksi = document.querySelector(".prediksi"),
      tabNavi = document.querySelector(".tab-navigation"),
      tabMenu = document.querySelectorAll(".tab-menu li"),
      predBlnSblm = document.querySelector(".card-1 .badge"),
      blnSblmPred = document.querySelectorAll(".card-1 h3")[1],
      rilisBlnSblm = document.querySelector(".card-2 .badge"),
      blnSblmRilis = document.querySelectorAll(".card-2 h3")[1],
      blnSkrgPred = document.querySelectorAll(".card-3 h3")[1],
      predSkrg = document.querySelector(".card-3 p"),
      komLeading = document.querySelector(".card-4"),
      komLeadingKor = document.querySelector(".card-4 .card h3"),
      
      noBerita = document.querySelector(".berita h3"),
      heading = document.querySelector(".heading"),
      linkHeading = document.querySelectorAll(".heading .link-berita"),
      gambarHeading = document.querySelector(".heading img"),
      judulHeading = document.querySelector(".heading h4"),
      lokasiHeading = document.querySelectorAll(".heading p")[0],
      jenisHeading = document.querySelectorAll(".heading p")[1],

      beritaSisa = document.querySelector(".berita-sisa");

// KHUSUS DI TAB PREDIKSI !!!
const saringBeritaHandler = (saring) => {
    let predAktif = document.querySelectorAll(".tab-btn")[0];
    
    // Jika berita kosong
    if (saring.length == 0) {
        // Jika sedang berada di tab Prediksi
        if (predAktif.classList.length == 2) {
            // Tampilkan pesan
            notif("Fenomena Pendukung Tidak Tersedia", "info", "");
        }

        // Kosongkan field Fenomena Pendukung di tab prediksi
        heading.setAttribute("style", "display: none; ");
        beritaSisa.setAttribute("style", "display: none; ");
        noBerita.innerHTML = "Maaf, Fenomena Pendukung Tidak Tersedia";

    } else {
        // Ada beritanya
        let now = new Date();
        let blnSkrg;
        let tglSkrg;
        if (now.getMonth()+1 < 10) {
            blnSkrg = `0${now.getMonth()+1}`;
        } else {
            blnSkrg = now.getMonth()+1;
        }
        if (now.getDate() < 10) {
            tglSkrg = `0${now.getDate()}`;
        } else {
            tglSkrg = now.getDate();
        }

        if ((saring.length > 10 && pilihKota.innerHTML.includes("---")) && 
            (endDate.value == `${now.getFullYear()}-${blnSkrg}-${tglSkrg}` && predAktif.classList.length == 2)) {
            notif("Jumlah Berita Melebihi yang Dapat Ditampilkan", "info", "Hanya Bisa Menampilkan Maksimum 10 Berita di Tab Ini, Silakan Geser ke Tab Grafik Atau Persempit Pilihan Anda");
        }
        
        // Untuk heading
        let beritaHeading = saring[0];
        noBerita.innerHTML = "Fenomena Pendukung";
        heading.removeAttribute("style");
        
        linkHeading.forEach((l) => l.setAttribute("href", beritaHeading.link)); // link berita

        // Ini gambarnya
        if (beritaHeading.image != null) {
            gambarHeading.setAttribute("src", beritaHeading.image);
        } else {
            gambarHeading.setAttribute("src", "img/hero-vr.png");            
        }
        gambarHeading.setAttribute("alt", beritaHeading.judul);

        judulHeading.innerHTML = beritaHeading.judul;
        lokasiHeading.innerHTML = `Lokasi: <span class="lokasi">${beritaHeading.lokasi}</span>`;
        jenisHeading.innerHTML = `Komoditas: ${beritaHeading.jenis[0].toUpperCase() + beritaHeading.jenis.slice(1, beritaHeading.jenis.length)}`;

        // Untuk 9 berita sisanya
        beritaSisa.removeAttribute("style");
        let beritaTampilSisa = saring.slice(1,10);

        // Mapping berita sisa
        let wow = beritaTampilSisa.map((x) => `<div class="berita-single"><div class="kabkot-single" onclick="updateName(this); filterBerita(); filterHarga(); filterMomentum()">${x.lokasi}</div><a target="_blank" href="${x.link}"><img src="${x.image}" style="width: 100%; max-height: 500px" alt="${x.judul}"></a><div style="padding-left: 24px; padding-right: 24px; padding-top: 16px; padding-bottom: 16px;"><div class="judul-single"><a target="_blank" href="${x.link}">${x.judul}</a></div></div><p style="text-align: center; padding-bottom: 15px;">Komoditas: ${x.jenis[0].toUpperCase() + x.jenis.slice(1, x.jenis.length)}</p></div>`).join("");
        let isiSisa = wow.replaceAll(`src="null"`, `src="img/hero-vr.png"`);

        beritaSisa.innerHTML = isiSisa;
        
    }
}

// Inisialisasi chart sentimen
let dataSentimen = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Weekly Sales',
      data: [25, 20, 6, 9, 15, 13, 9],
      backgroundColor: 'rgba(255, 26, 104, 0.2)',
      borderColor: 'rgba(255, 26, 104, 1)',
      borderWidth: 1
    }]
};

  let configSentimen = {
    type: 'line',
    data: dataSentimen,
    options: {
      responsive: true,
      maintainAspectRatio: false
    },
  };

  // render init block
const chartSentimen = new Chart(myChartSentimen.getContext("2d"), configSentimen);

  let configFenomena = {
    type: 'doughnut',
    data: dataSentimen,
    options: {
      responsive: true,
      maintainAspectRatio: false
    },
  };

const chartFenomena = new Chart(myChartFenomena.getContext("2d"), configFenomena);

// Inisialisasi wordcloud
let awankata = document.querySelector(".wordcloud");
let colors = ["#7e38b7", "#99cced", "#c4feff", "#8a00c2", "#a000c8", "#b100cd", "#ca5cdd",
              "#da8ee7", "#e8bcf0", "9c89ff", "#4c00b0", "#7600bc", "#be2ed6", "#541675"];
const width = 900;
const height = 600;

const svg = d3
    .select(".cloud")
    .append("svg")
    .attr("width", "100%")
    .attr("height", height);

// Momentum dan sentimen berita
// KHUSUS DI TAB GRAFIK !!!
const momentumHandler = (momen) => {
    let grafAktif = document.querySelectorAll(".tab-btn")[1];
    let kota = pilihKota.innerText;

    let blnAwal;
    let blnAkhir;
    let periode;
        
    if (startDate.value.split("-")[1] == 1) {
        blnAwal = "Januari"
    }
    if (endDate.value.split("-")[1] == 1) {
        blnAkhir = "Januari"
    }
    
    if (startDate.value.split("-")[1] == 2) {
        blnAwal = "Februari"
    }
    if (endDate.value.split("-")[1] == 2) {
        blnAkhir = "Februari"
    }

    if (startDate.value.split("-")[1] == 3) {
        blnAwal = "Maret"
    }
    if (endDate.value.split("-")[1] == 3) {
        blnAkhir = "Maret"
    }
    
    if (startDate.value.split("-")[1] == 4) {
        blnAwal = "April"
    }
    if (endDate.value.split("-")[1] == 4) {
        blnAkhir = "April"
    }
    
    if (startDate.value.split("-")[1] == 5) {
        blnAwal = "Mei"
    }
    if (endDate.value.split("-")[1] == 5) {
        blnAkhir = "Mei"
    }
    
    if (startDate.value.split("-")[1] == 6) {
        blnAwal = "Juni"
    }
    if (endDate.value.split("-")[1] == 6) {
        blnAkhir = "Juni"
    }
    
    if (startDate.value.split("-")[1] == 7) {
        blnAwal = "Juli"
    }
    if (endDate.value.split("-")[1] == 7) {
        blnAkhir = "Juli"
    }
    
    if (startDate.value.split("-")[1] == 8) {
        blnAwal = "Agustus"
    }
    if (endDate.value.split("-")[1] == 8) {
        blnAkhir = "Agustus"
    }
    
    if (startDate.value.split("-")[1] == 9) {
        blnAwal = "September"
    }
    if (endDate.value.split("-")[1] == 9) {
        blnAkhir = "September"
    }
    
    if (startDate.value.split("-")[1] == 10) {
        blnAwal = "Oktober"
    }
    if (endDate.value.split("-")[1] == 10) {
        blnAkhir = "Oktober"
    }
    
    if (startDate.value.split("-")[1] == 11) {
        blnAwal = "November"
    }
    if (endDate.value.split("-")[1] == 11) {
        blnAkhir = "November"
    }
    
    if (startDate.value.split("-")[1] == 12) {
        blnAwal = "Desember"
    }
    if (endDate.value.split("-")[1] == 12) {
        blnAkhir = "Desember"
    }

    let tglAwal;
    let tglAkhir;

    if (startDate.value.split("-")[2][0] == 0) {
        tglAwal = startDate.value.split("-")[2][1]
    } else {
        tglAwal = startDate.value.split("-")[2]
    }

    if (endDate.value.split("-")[2][0] == 0) {
        tglAkhir = endDate.value.split("-")[2][1]
    } else {
        tglAkhir = endDate.value.split("-")[2]
    }

    // Jika bulannya sama
    if (blnAwal == blnAkhir) {
        periode = `${tglAwal}-${tglAkhir} ${blnAwal} ${startDate.value.split("-")[0]}`
    }

    // Jika bulannya berbeda dan tahunnya sama
    if (blnAwal != blnAkhir && startDate.value.split("-")[0] == endDate.value.split("-")[0]) {
        periode = `${tglAwal} ${blnAwal} - ${tglAkhir} ${blnAkhir} ${startDate.value.split("-")[0]}`
    }

    // Jika bulannya berbeda dan tahunnya berbeda
    if ((blnAwal != blnAkhir) && (startDate.value.split("-")[0] != endDate.value.split("-")[0])) {
        periode = `${tglAwal} ${blnAwal} ${startDate.value.split("-")[0]} - ${tglAkhir} ${blnAkhir} ${endDate.value.split("-")[0]}`
    }

    const sentimen = document.querySelector(".sentimen");
    const phenomena = document.querySelector(".fenomena");
    
    if (momen.length == 0) {
        // Jika sedang berada di Tab Grafik
        if (grafAktif.classList.length == 2) {
            // Tampilkan pesan
            if (kota.includes("---")) {
                notif(`Fenomena Pendukung pada Periode ${periode} Tidak Tersedia`, "info", "");
            } else {
                if (kota.includes("Kota")) {
                    notif(`Fenomena Pendukung di ${kota} pada Periode ${periode} Tidak Tersedia`, "info", "");
                } else {
                    notif(`Fenomena Pendukung di Kabupaten ${kota} pada Periode ${periode} Tidak Tersedia`, "info", "");
                }
            }
        }
        
        // Hide chart
        sentimen.style.display = "none"
        phenomena.style.display = "none"
        awankata.style.display = "none"
    } else {
        // Pie chart sentimen
        let sntmen = ["Negatif", "Netral", "Positif"];
        let kota = momen[0].lokasi;
        let city;

        if (!pilihKota.innerHTML.includes("---")) {
            if (kota.includes("Kota")) {
                city = kota
            } else {
                city = `Kabupaten ${kota}`
            }
        } else {
            city = "Provinsi Jawa Timur";
        }

        // Datanya
        let banyakSntmen = [
            momen.filter((m) => m.sentimen == -1).length,
            momen.filter((m) => m.sentimen == 0).length,
            momen.filter((m) => m.sentimen == 1).length
        ];

        const dataSntmen = {
            labels: sntmen,
            datasets: [{
                data: banyakSntmen,
                label: "Banyaknya Sentimen",
                backgroundColor: ['rgb(203, 74, 247)', '#fff', '#5b85ff'],
                borderColor: "rgba(0, 0, 0, 0.1)"
            }]
        }

        const animasi = {
            animateScale: true,
            duration: 1200
        }
        const titleFont = {
            size: 18,
            weight: 'bold'
        }
        const legenda = {
            display: true,
            position: 'bottom',
            labels: {
                color: "#fff"
            }
        }

        const configSntmen = {
            type: "pie",
            data: dataSntmen,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: animasi,
                plugins: {
                    title: {
                        display: true,
                        text: [`Sentimen Masyarakat di ${city} terhadap Perubahan Harga`, `Komoditas Leading Periode ${periode}`],
                        font: titleFont,
                        color: "#fff"
                    },
                    tooltip: {
                        // Buang nilai 0
                        filter: (tooltipItem) => tooltipItem.raw > 0,
                        titleFont: {
                            size: 20
                        },
                        bodyFont: {
                            size: 18
                        },
                        // Untuk persentase
                        callbacks: {
                            label: function (tooltipData) {
                                const values = tooltipData.dataset.data[tooltipData.dataIndex]; 
                                const result = tooltipData.dataset.data.reduce((a, b) => a + b); 
                                const percentage = (values / result) * 100; 
                                if (Number.isInteger(percentage)) {
                                    return `Persentase: ${percentage}%`
                                } else {
                                    return `Persentase: ${percentage.toFixed(2).replace(".", ",")}%`
                                }
                            }
                        }
                    },
                    legend: legenda
                }
            }
        }

        chartSentimen.config._config = configSntmen;
        chartSentimen.update();

        // Tampilkan grafiknya
        sentimen.style.display = "block";

        // Pie chart fenomena/momentum
        let why = ['Stok', 'Permintaan', 'Panen', 'Momentum'];

        // Datanya
        let banyakFenomena = [
            momen.map(s => s.stok).filter((e) => e == 1).length,
            momen.map(s => s.permintaan).filter((e) => e == 1).length,
            momen.map(s => s.panen).filter((e) => e == 1).length,
            momen.map(s => s.momentum).filter((e) => e == 1).length
        ];

        // Jika tidak ada fenomena
        if (banyakFenomena.reduce((a,b) => a+b) == 0) {
            phenomena.style.display = "none";
            notif(`Tidak Ada Topik Fenomena Terkait Perubahan Harga Komoditas Leading di ${city} Periode ${periode}`, "info", "");
        } else {
            const dataFenomena = {
                labels: why,
                datasets: [{
                    data: banyakFenomena,
                    label: "Banyaknya Fenomena",
                    backgroundColor: ['#541675', '#7e38b7', '#9c89ff', '#99cced'],
                    borderColor: "rgba(0, 0, 0, 0.1)"
                }]
            }
    
            const configFenomena = {
                type: "pie",
                data: dataFenomena,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: animasi,
                    plugins: {
                        title: {
                            display: true,
                            text: [`Perubahan Harga Komoditas Leading di ${city}`, `Menurut Topik Fenomena Periode ${periode}`],
                            font: titleFont,
                            color: '#fff'
                        },
                        tooltip: {
                            // Buang nilai 0
                            filter: (tooltipItem) => tooltipItem.raw > 0,
                            titleFont: {
                                size: 20
                            },
                            bodyFont: {
                                size: 18
                            },
                            // Untuk persentase
                            callbacks: {
                                label: function (tooltipData) {
                                    const values = tooltipData.dataset.data[tooltipData.dataIndex]; 
                                    const result = tooltipData.dataset.data.reduce((a, b) => a + b); 
                                    const percentage = (values / result) * 100; 
                                    if (Number.isInteger(percentage)) {
                                        return `Persentase: ${percentage}%`
                                    } else {
                                        return `Persentase: ${percentage.toFixed(2).replace(".", ",")}%`
                                    }
                                }
                            }
                        },
                        legend: legenda
                    }
                }
            }
    
            chartFenomena.config._config = configFenomena;
            chartFenomena.update();
    
            // Tampilkan grafiknya
            phenomena.style.display = "block";
            
        }

        // Wordcloud Rekomendasi Kebijakan
        let rekoms = momen.map(e => e.rekomKebijakan).map(y => y.split(", "));
        let wcloud = [];
        rekoms.forEach((x) => wcloud.push(...x));
    
        // Item unik
        let rekomUnik = [... new Set(wcloud)];    
        
        let banyakRekomUnik = [];
        rekomUnik.forEach((u) => banyakRekomUnik.push(wcloud.filter(w => w == u).length));
    
        // Objek berpasangan
        let psgRekom = createObject(rekomUnik, banyakRekomUnik);
    
        // Buat objeknya
        let words = []
        rekomUnik.forEach((r) => words.push({word: r, quantity: psgRekom[r]}));
    
        let layout;
    
        if (pilihKota.innerText.includes("---")) {
            layout = d3.layout
                                .cloud()
                                .size([width, height])
                                .words(
                                    words.map((w) => ({
                                        text: w.word,
                                        size: Math.min(w.quantity * 6, 80)
                                    }))
                                )
                                .padding(5)
                                .rotate(0)
                                .fontSize((d) => d.size)
                                .spiral("rectangular")
                                .on("end", draw);
            layout.start();
        } else {
            layout = d3.layout
                                .cloud()
                                .size([width, height])
                                .words(
                                    words.map((w) => ({
                                        text: w.word,
                                        size: Math.min(w.quantity * 20, 80)
                                    }))
                                )
                                .padding(5)
                                .rotate(0)
                                .fontSize((d) => d.size)
                                .spiral("rectangular")
                                .on("end", draw);
            layout.start();
            
        }

        document.querySelectorAll(".judul-wcloud")[0].innerText = `Rekomendasi Kebijakan untuk ${city} pada Perkembangan Harga`
        document.querySelectorAll(".judul-wcloud")[1].innerText = `Komoditas Leading Periode ${periode}`
        
        function draw(words) {
            console.log("wordcloud baru")
            // HP (Portrait)
            function scw600() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(155, 180) scale(0.3)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // HP (Landscape)
            function scw920() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(345, 170) scale(0.5)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // iPad Mini (portrait)
            function scw768() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(270, 200) scale(0.52)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // iPad Air (portrait)
            function scw820() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(335, 230) scale(0.65)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // iPad Pro (portrait)
            function scw1024() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(370, 265) scale(0.7)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // iPad Pro (landscape)
            function scw1366() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(570, 315) scale(0.85)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // Asus Zenbook Fold (portrait)
            function scw860() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(365, 280) scale(0.7)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // Asus Zenbook Fold (landscape)
            function scw1280() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(530, 300) scale(0.9)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            // Desktop
            function scwDesk() {
                svg.selectAll("*").remove();
                svg.append("g")
                   .attr("transform", "translate(530, 295) scale(0.95)")
                   .selectAll("text")
                   .data(words)
                   .enter()
                   .append("text")
                   .style("font-size", (d) => d.size + "px")
                   .style("fill", (d, i) => colors[i % colors.length])
                   .attr("text-anchor", "middle")
                   .attr("transform", (d) => `translate(${[d.x, d.y]}) rotate(${d.rotate})`)
                   .text((d) => d.text);
            }
        
            if (screen.width <= 600) {
                scw600();
            }
            if (screen.width > 600 && screen.width <= 768) {
                scw768();
            }
            if (screen.width > 768 && screen.width <= 820) {
                scw820();
            }
            if (screen.width > 820 && screen.width <= 860) {
                scw860();
            }
            if (screen.width > 860 && screen.width <= 920) {
                scw920();
            }
            if (screen.width > 920 && screen.width <= 1024) {
                scw1024();
            }
            if (screen.width > 1024 && screen.width <= 1280) {
                scw1280();
            }
            if (screen.width > 1280 && screen.width <= 1366) {
                scw1366();
            }
            if (screen.width > 1366) {
                scwDesk();
            }
    
            window.onresize = () => {
                if (screen.width <= 600) {
                    scw600();
                }
                if (screen.width > 600 && screen.width <= 768) {
                    scw768();
                }
                if (screen.width > 768 && screen.width <= 820) {
                    scw820();
                }
                if (screen.width > 820 && screen.width <= 860) {
                    scw860();
                }
                if (screen.width > 860 && screen.width <= 920) {
                    scw920();
                }
                if (screen.width > 920 && screen.width <= 1024) {
                    scw1024();
                }
                if (screen.width > 1024 && screen.width <= 1280) {
                    scw1280();
                }
                if (screen.width > 1280 && screen.width <= 1366) {
                    scw1366();
                }
                if (screen.width > 1366) {
                    scwDesk();
                }
            }
            
        }
    
        awankata.style.display = "block";

    }
}

// Inisialisasi chart harga
let dataHarga = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Weekly Sales',
      data: [18, 12, 6, 9, 12, 3, 9],
      backgroundColor: 'rgba(255, 26, 104, 0.2)',
      borderColor: 'rgba(255, 26, 104, 1)',
      borderWidth: 1
    }]
  };

  // config 
  let configHarga = {
    type: 'line',
    data: dataHarga,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

// render init block
const chartHarga = new Chart(myChart.getContext("2d"), configHarga);

// Harga harian prov dan kabkot
const hargaHandler = (harga) => {
    let sbx = harga.map(e => e.konversi).map(x => x.slice(0, x.length-1));
    let kom = harga[0].komoditas.split(' (')[0];
    let kota = harga[0].kabkot;
    let city;
    let price = harga.map(e => e.harga);
    
    let blnAwal;
    let blnAkhir;
    let periode;
        
    if (startDate.value.split("-")[1] == 1) {
        blnAwal = "Januari"
    }
    if (endDate.value.split("-")[1] == 1) {
        blnAkhir = "Januari"
    }
    
    if (startDate.value.split("-")[1] == 2) {
        blnAwal = "Februari"
    }
    if (endDate.value.split("-")[1] == 2) {
        blnAkhir = "Februari"
    }
    
    if (startDate.value.split("-")[1] == 3) {
        blnAwal = "Maret"
    }
    if (endDate.value.split("-")[1] == 3) {
        blnAkhir = "Maret"
    }
    
    if (startDate.value.split("-")[1] == 4) {
        blnAwal = "April"
    }
    if (endDate.value.split("-")[1] == 4) {
        blnAkhir = "April"
    }
    
    if (startDate.value.split("-")[1] == 5) {
        blnAwal = "Mei"
    }
    if (endDate.value.split("-")[1] == 5) {
        blnAkhir = "Mei"
    }
    
    if (startDate.value.split("-")[1] == 6) {
        blnAwal = "Juni"
    }
    if (endDate.value.split("-")[1] == 6) {
        blnAkhir = "Juni"
    }
    
    if (startDate.value.split("-")[1] == 7) {
        blnAwal = "Juli"
    }
    if (endDate.value.split("-")[1] == 7) {
        blnAkhir = "Juli"
    }
    
    if (startDate.value.split("-")[1] == 8) {
        blnAwal = "Agustus"
    }
    if (endDate.value.split("-")[1] == 8) {
        blnAkhir = "Agustus"
    }
    
    if (startDate.value.split("-")[1] == 9) {
        blnAwal = "September"
    }
    if (endDate.value.split("-")[1] == 9) {
        blnAkhir = "September"
    }
    
    if (startDate.value.split("-")[1] == 10) {
        blnAwal = "Oktober"
    }
    if (endDate.value.split("-")[1] == 10) {
        blnAkhir = "Oktober"
    }
    
    if (startDate.value.split("-")[1] == 11) {
        blnAwal = "November"
    }
    if (endDate.value.split("-")[1] == 11) {
        blnAkhir = "November"
    }
    
    if (startDate.value.split("-")[1] == 12) {
        blnAwal = "Desember"
    }
    if (endDate.value.split("-")[1] == 12) {
        blnAkhir = "Desember"
    }

    // Jika bulannya sama
    if (blnAwal == blnAkhir) {
        periode = `${sbx[0].split(" ")[0]}-${sbx[sbx.length-1].split(" ")[0]} ${blnAwal} ${startDate.value.split("-")[0]}`
    }

    // Jika bulannya berbeda dan tahunnya sama
    if (blnAwal != blnAkhir && startDate.value.split("-")[0] == endDate.value.split("-")[0]) {
        periode = `${sbx[0].split(" ")[0]} ${blnAwal} - ${sbx[sbx.length-1].split(" ")[0]} ${blnAkhir} ${startDate.value.split("-")[0]}`
    }

    // Jika bulannya berbeda dan tahunnya berbeda
    if ((blnAwal != blnAkhir) && (startDate.value.split("-")[0] != endDate.value.split("-")[0])) {
        periode = `${sbx[0].split(" ")[0]} ${blnAwal} ${startDate.value.split("-")[0]} - ${sbx[sbx.length-1].split(" ")[0]} ${blnAkhir} ${endDate.value.split("-")[0]}`
    }

    if (!pilihKota.innerHTML.includes("---")) {
        if (kota.includes("Kota")) {
            city = kota
        } else {
            city = `Kabupaten ${kota}`
        }
    } else {
        city = "Provinsi Jawa Timur";
    }
    
    let teksGrafik;
    if (city == "Provinsi Jawa Timur") {
        teksGrafik = [`Harga Rata-Rata ${kom}`, `di ${city} Periode ${periode}`]
    } else {
        teksGrafik = [`Harga ${kom}`, `di ${city} Periode ${periode}`]
    }
    
    let grafikAktif = document.querySelectorAll(".tab-btn")[1];
    if (screen.width < 600) {
        // Jika sedang berada di Tab Grafik
        if (grafikAktif.classList.length == 2) {
            notif("Miringkan Posisi HP Anda Agar Grafik Mudah Terbaca", "info", "");
        }
    }

    // Menghitung stdev
    let rego = [];
    price.forEach((p) => {
        rego.push({'x': p});
    });

    let stats = new Statistics(rego, {x: 'metric'});
    let stdev = stats.standardDeviation(price);
    
    function stDevFix(stdev) {
        if (stdev == 0) {
            return 0;
        }

        let stDevOlah = stdev.toFixed(2).replace(".", ",");
        
        let sblmKoma = stDevOlah.split(",")[0];
        let ssdKoma = stDevOlah.split(",")[1];
        
        if (sblmKoma.length == 6) {
            return `${sblmKoma.slice(0,3)}.${sblmKoma.slice(-3)},${ssdKoma}`;
        } else {
            if (sblmKoma.length == 5) {
                return `${sblmKoma.slice(0,2)}.${sblmKoma.slice(-3)},${ssdKoma}`;
            } else {
                if (sblmKoma.length == 4) {
                    return `${sblmKoma[0]}.${sblmKoma.slice(-3)},${ssdKoma}`;
                } else {
                    return stDevOlah;
                }
            }
        }
    }

    let warnaGaris;
    let komTerpilih = bapo.selectedIndex;
    if (komTerpilih == 1) {
        warnaGaris = '#cb4af7'
    }
    if (komTerpilih == 2) {
        warnaGaris = 'orange'
    }
    if (komTerpilih == 3) {
        warnaGaris = '#ff6464'
    }
    if (komTerpilih == 4) {
        warnaGaris = '#5b85ff'
    }
    if (komTerpilih == 5) {
        warnaGaris = '#129014'
    }

    const dataHarga = {
        labels: sbx,
        datasets: [{
            data: price,
            label: `Harga ${kom}`,
            borderColor: warnaGaris,
            backgroundColor: warnaGaris,
            pointBackgroundColor: warnaGaris
        }]
    }

    let delayed;

    const configHarga = {
        type: "line",
        data: dataHarga,
        options: {
            tension: 0.3,
            hitRadius: 30,
            hoverRadius: 8,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        color: "#fff"
                    }
                },
                y: {
                    ticks: {
                        callback: function(value) {
                            let nilai = value.toString();

                            if (nilai.length == 6) {
                                return `Rp${nilai.slice(0,3)}.${nilai.slice(-3)}`;
                            } else {
                                if (nilai.length == 5) {
                                    return `Rp${nilai.slice(0,2)}.${nilai.slice(-3)}`;
                                } else {
                                    return `Rp${nilai[0]}.${nilai.slice(-3)}`;
                                }
                            }
                        },
                        color: "#fff"
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: teksGrafik,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: "#fff"
                },
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        color: "#fff"
                    },
                    title: {
                        display: true,
                        text: `Standar Deviasi: ${stDevFix(stdev)}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 8,
                        color: 'skyblue'
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 20
                    },
                    bodyFont: {
                        size: 18
                    },
                    callbacks: {
                            label: function (tooltipData) {
                                const values = tooltipData.dataset.data[tooltipData.dataIndex].toString();
                                
                                if (values.length == 6) {
                                    if (pilihKota.innerText.includes("---")) {
                                        return `Harga Rata-Rata: Rp${values.slice(0,3)}.${values.slice(-3)}`;
                                    } else {
                                        return `Harga: Rp${values.slice(0,3)}.${values.slice(-3)}`;
                                        
                                    }
                                } else {
                                    if (values.length == 5) {
                                        if (pilihKota.innerText.includes("---")) {
                                            return `Harga Rata-Rata: Rp${values.slice(0,2)}.${values.slice(-3)}`;
                                        } else {
                                            return `Harga: Rp${values.slice(0,2)}.${values.slice(-3)}`;
                                        }
                                    } else {
                                        if (pilihKota.innerText.includes("---")) {
                                            return `Harga Rata-Rata: Rp${values[0]}.${values.slice(-3)}`;
                                        } else {
                                            return `Harga: Rp${values[0]}.${values.slice(-3)}`;
                                        }
                                    }
                                }
                                
                            }
                    }
                }
            },
            animation: {
                onComplete: () => {
                  delayed = true;
                },
                delay: (context) => {
                  let delay = 0;
                  if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 100 + context.datasetIndex * 100;
                  }
                  return delay;
                }
            }
        }
    }

    chartHarga.config._config = configHarga;
    // responsiveFonts(); // sudah ada chartHarga.update() nya
    
    chartHarga.update();
    
    // Tampilkan grafiknya
    document.querySelector(".hargabapo").style.display = "block";
}

// Dropdown wilayah
const wrapper = document.querySelector(".wrapper"),
      selectBtn = wrapper.querySelector(".select-btn"),
      options = wrapper.querySelector(".options");

// Switch between tab
const tabs = document.querySelectorAll(".tab"),
      tabBtns = document.querySelectorAll(".tab-btn");

const tab_Nav = (tabBtnClick) => {
    tabBtns.forEach((tabBtn) => {
        tabBtn.classList.remove("aktif");
    });

    tabs.forEach((tab) => {
        tab.classList.remove("murup");
    });

    tabBtns[tabBtnClick].classList.add("aktif");
    tabs[tabBtnClick].classList.add("murup");
}

tabBtns.forEach((tabBtn, i) => {
    tabBtn.addEventListener('click', () => {
        tab_Nav(i);
    });
});

// Array wilayah (dari gsheet)
let cities = ['--- Provinsi Jatim ---','Pacitan', 'Ponorogo', 'Trenggalek', 'Tulungagung', 'Blitar', 'Kediri', 'Malang', 'Lumajang', 'Jember', 
              'Banyuwangi', 'Bondowoso', 'Situbondo', 'Probolinggo', 'Pasuruan', 'Sidoarjo', 'Mojokerto', 'Jombang', 'Nganjuk', 'Madiun', 'Magetan', 
              'Ngawi', 'Bojonegoro', 'Tuban', 'Lamongan', 'Gresik', 'Bangkalan', 'Sampang', 'Pamekasan', 'Sumenep', 'Kota Kediri', 'Kota Blitar', 
              'Kota Malang', 'Kota Probolinggo', 'Kota Pasuruan', 'Kota Mojokerto', 'Kota Madiun', 'Kota Surabaya', 'Kota Batu'];

function addWil(kotaTerpilih) {
    options.innerHTML = "";
    if (kotaTerpilih == null) {
        // Mapping list cities ke dropdown wilayah
        let kabkotAwal = cities.map(kota => `<li onclick="updateName(this); filterBerita(); filterMomentum(); filterHarga()">${kota}</li>`).join("");
        options.innerHTML = kabkotAwal;

    } else {
        // Array kabkot baru yang terurut dan langsung mapping ke dropdown wilayah
        let kabkotMurup = cities.sort((x,y) => x == kotaTerpilih ? -1 : y == kotaTerpilih ? 1 : 0)
                            .map(data => `<li onclick="updateName(this); filterBerita(); filterMomentum(); filterHarga()">${data}</li>`).join("");
        options.innerHTML = kabkotMurup;
        
        // MENYALA Abangkuuh 🔥🔥
        let menyala = document.querySelector(".options li");
        menyala.setAttribute("class", "terpilih");
    }
    
}

addWil();

function updateName(selectedLi) {
    // Kosongkan inputnya setelah diklik
    kabkot.value = "";

    addWil(selectedLi.innerHTML);
    wrapper.classList.remove("active");
    pilihKota.innerHTML = selectedLi.innerHTML;
}

// Untuk placeholder
        let pholders = ['Cari kotanya ...', 'Tekan ⬆️ atau ⬇️ untuk menelusuri', 'Tekan Enter untuk memilih', 'Tekan esc untuk batal'];
        function showPlaceHolders() {
            let i = 0;
        
            // Placeholder awal
            let teks = pholders[i++ % pholders.length]; // modulo
            kabkot.placeholder = teks;
            
            // Berubah setiap 5 detik
            setInterval(() => {
                let teks = pholders[i++ % pholders.length]; // modulo
                kabkot.placeholder = teks;
            }, 3000);
        }
        showPlaceHolders();

        // UX untuk dropdown wilayah
        kabkot.addEventListener('keyup', (e) => {
            if (((e.keyCode != 40 || e.keyCode != 38) || (e.keyCode != 13 || e.keyCode != 27)) || 
                e.keyCode != 8) {
                let searchedVal = kabkot.value.toLowerCase();
                let arr = cities.filter(data => {
                    return data.toLowerCase().includes(searchedVal);
                });
                let murup = pilihKota.innerHTML;
            
                if ((murup.includes("---")) || !arr.includes(murup)) {
                    // Mengembalikan array kabkot dari input yg diketikkan user
                    // Dan mapping array ini ke list kabkot serta join semuanya
                    arr = arr.map(data => `<li onclick="updateName(this); filterBerita(); filterHarga(); filterMomentum()">${data}</li>`).join("");
                    options.innerHTML = arr ? arr : `<p style="font-size: 12px;">Maaf, kabupaten/kota tidak ditemukan!</p>`;
                }
                if (arr.includes(murup)) {
                    // Array kabkot baru yang terurut
                    let kabkotMurup = arr.sort((x,y) => x == murup ? -1 : y == murup ? 1 : 0)
                                    // Kemudian mapping dan join ke dropdown wilayah
                                    .map(data => `<li onclick="updateName(this); filterBerita(); filterHarga(); filterMomentum()">${data}</li>`).join("");
                    options.innerHTML = kabkotMurup;
            
                    // MENYALA Abangkuuh 🔥🔥
                    let menyala = document.querySelector(".options li");
                    menyala.setAttribute("class", "terpilih");
            
                }
            } 
        
            // Escape, down, up, enter, backspace
            let elem = document.querySelectorAll(".options li");
            let sorot;
        
                // Escape
                if (e.keyCode == 27) {
                    let murup = pilihKota.innerHTML;
                    let menyala = document.querySelector(".options li");
        
                    // Cek apakah sudah pernah filter kabkot
                    if (menyala.classList[0] == undefined) {
                        if (!murup.includes("---")) {
                            addWil(murup);
                            kabkot.value = "";
                        } else {
                            addWil();
                            kabkot.value = "";
                        }
                    } else {
                        addWil(menyala.innerHTML);
                        kabkot.value = "";
                    }
                    
                    wrapper.classList.remove("active");
                    hitung.innerHTML = -1;
                    countIsi.innerHTML = -1;
                }
        
                // Down
                if (e.keyCode == 40) {
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        // Abaikan saja, karena ada 38 baris
                        sorot = elem[++hitung.innerHTML];
                        sorot.classList.add("tersorot");
                    } else {
                        // Sudah pernah search
                        if (countIsi.innerHTML >= elem.length-1) {
                            sorot = elem[elem.length-1];
                            sorot.classList.add("tersorot");   
                        }
                        if (countIsi.innerHTML == elem.length-1) {
                            sorot = elem[elem.length-1];
                            sorot.classList.add("tersorot");   
                        }
                        if (countIsi.innerHTML < elem.length-1) {
                            sorot = elem[++countIsi.innerHTML];
                            sorot.classList.add("tersorot");   
                        }
                        
                    }
                }
                
                // Up
                if (e.keyCode == 38) {
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        if (hitung.innerHTML <= -1) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                            hitung.innerHTML = 0;
                        }
                        if (hitung.innerHTML == 0) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                        }
                        if (hitung.innerHTML > 0) {
                            sorot = elem[--hitung.innerHTML];
                            sorot.classList.add("tersorot");
                        }
                    } else {
                        // Sudah pernah search
                        if (countIsi.innerHTML <= -1) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                            countIsi.innerHTML = 0;
                        }
                        if (countIsi.innerHTML == 0) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                        }
                        if (countIsi.innerHTML > 0) {
                            sorot = elem[--countIsi.innerHTML];
                            sorot.classList.add("tersorot");
                        }
                    }
                }
                
                // Enter
                if (e.keyCode == 13) {
                    let terpilih;
        
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        if (hitung.innerHTML == -1) {
                            notif("Mohon Pilih Wilayah Terlebih Dahulu!", "error", "");
                        } else {
                            terpilih = elem[hitung.innerHTML];
                            updateName(terpilih);
                            filterBerita();
                            filterHarga();
                            filterMomentum();
                        }
                        
                    } else {
                        // Sudah pernah search
                        // Jika panjang array == 1, langsung pilih elemen pertama
                        if (elem.length == 1) {
                            updateName(elem[0]);
                            filterBerita();
                        } else {
                            if (countIsi.innerHTML == -1) {
                                notif("Mohon Pilih Wilayah Terlebih Dahulu!", "error", "");
                            } else {
                                terpilih = elem[countIsi.innerHTML];
                                updateName(terpilih);
                                filterBerita();
                                filterHarga();
                                filterMomentum();
                            }
                            
                        }
                    }
        
                    if (options.innerHTML == `<p style="font-size: 12px;">Maaf, kabupaten/kota tidak ditemukan!</p>`) {
                        notif("Maaf! Kabupaten/Kota Yang Anda Cari Tidak Tersedia!", "error", "");
                    }
                    
                    hitung.innerHTML = -1;
                    countIsi.innerHTML = -1;
                }
                
                // Backspace
                if (e.keyCode == 8) {
                    hitung.innerHTML = -1
                    countIsi.innerHTML = -1
                }
        });

        // Membuka dropdown wilayah jika diklik
        selectBtn.addEventListener("click", () => {
            wrapper.classList.toggle("active");
            kabkot.focus(); // Langsung fokus ngetik kabkot
        });

        // Klik di luar dropdown wilayah
        window.addEventListener('click', (e) => {
            if ((e.target != kabkot && e.target != pilihKota) && e.target != selectBtn) {
                wrapper.classList.remove("active");
                hitung.innerHTML = -1;
                countIsi.innerHTML = -1;
            }
        });

// KHUSUS DI TAB PREDIKSI !!!
function filterBerita() {
    
    if (analyze.value == "on") {
        // Jika komoditas dan wilayah belum dipilih
        if (bapo.options[bapo.selectedIndex].getAttribute("jenis") == null && pilihKota.innerHTML.includes("---")) {
            // Tampilkan semua berita all komoditas dan all wilayah
            getSheetData({
                sheetName: "Berita",
                query: `SELECT * WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}' ORDER BY I DESC`,
                callback: saringBeritaHandler
            });
        }

        // Jika memilih KOMODITAS SAJA
        if (bapo.options[bapo.selectedIndex].getAttribute("jenis") != null && pilihKota.innerHTML.includes("---")) {
            getSheetData({
                sheetName: "Berita",
                query: `SELECT * WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}' AND A = '${bapo.options[bapo.selectedIndex].getAttribute("jenis")}' ORDER BY I DESC`,
                callback: saringBeritaHandler
            });      
        }

        // Jika memilih WILAYAH SAJA
        if (bapo.options[bapo.selectedIndex].getAttribute("jenis") == null && !pilihKota.innerHTML.includes("---")) {
            getSheetData({
                sheetName: "Berita",
                query: `SELECT * WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}' AND H = '${pilihKota.innerHTML}' ORDER BY I DESC`,
                callback: saringBeritaHandler
            });      
        }

        // Memilih semuanya
        if (bapo.options[bapo.selectedIndex].getAttribute("jenis") != null && !pilihKota.innerHTML.includes("---")) {
            getSheetData({
                sheetName: "Berita",
                query: `SELECT * WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}' AND A = '${bapo.options[bapo.selectedIndex].getAttribute("jenis")}' AND H = '${pilihKota.innerHTML}' ORDER BY I DESC`,
                callback: saringBeritaHandler
            });      
        }
    }
}

// Momentum dan sentimen berita
// KHUSUS DI TAB GRAFIK !!!
function filterMomentum() {
    if (analyze.value == "on") {
        // Jika wilayah belum dipilih
        if (pilihKota.innerHTML.includes("---")) {
            getSheetData({
                sheetName: "Berita",
                query: `SELECT D, E, F, G, H, I, J, K WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}'`,
                callback: momentumHandler
            });
            
        } else {
            getSheetData({
                sheetName: "Berita",
                query: `SELECT D, E, F, G, H, I, J, K WHERE I >= date '${startDate.value}' AND I <= date '${endDate.value}' AND H = '${pilihKota.innerHTML}'`,
                callback: momentumHandler
            });

        }
    }
}

// Harga harian prov dan kabkot
function filterHarga() {
    if (analyze.value == "on") {
        const hargabapo = document.querySelector(".hargabapo");

        if (bapo.options[bapo.selectedIndex].value == "") {
            hargabapo.style.display = "none";
        } else {
            // Belum memilih wilayah
            if (pilihKota.innerHTML.includes("---")) {
                // Tampilkan harga harian prov
                getSheetData({
                    sheetName: "Harian Prov",
                    query: `SELECT * WHERE C >= date '${startDate.value}' AND C <= date '${endDate.value}' AND A = ${bapo.options[bapo.selectedIndex].value} ORDER BY C ASC`,
                    callback: hargaHandler
                });
            } else {
                // Sudah memilih wilayah, tampilkan harga per wilayah
                getSheetData({
                    sheetName: "Harian",
                    query: `SELECT * WHERE C >= date '${startDate.value}' AND C <= date '${endDate.value}' AND A = ${bapo.options[bapo.selectedIndex].value} AND E = '${pilihKota.innerHTML}' ORDER BY C ASC`,
                    callback: hargaHandler
                });
            }
            
        }
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

// Transpose matriks
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Perkalian matrix
function multiply(matrixA, matrixB) {
    const result = Array(matrixA.length).fill(0).map(() => Array(matrixB[0].length).fill(0));
    
    for (let i = 0; i < matrixA.length; i++) {
      for (let j = 0; j < matrixB[0].length; j++) {
        for (let k = 0; k < matrixA[0].length; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    
    return result;
}

// Invers matrix
function inverse(matrix) {
    const size = matrix.length;
    const augmentedMatrix = matrix.map((row, rowIndex) => [...row, ...Array(size).fill(0).map((_, colIndex) => rowIndex === colIndex ? 1 : 0)]);
  
    for (let i = 0; i < size; i++) {
      let maxElementIndex = i;
      for (let j = i + 1; j < size; j++) {
        if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxElementIndex][i])) {
          maxElementIndex = j;
        }
      }
  
      if (augmentedMatrix[maxElementIndex][i] === 0) {
        throw new Error("Matrix is singular and cannot be inverted");
      }
  
      [augmentedMatrix[i], augmentedMatrix[maxElementIndex]] = [augmentedMatrix[maxElementIndex], augmentedMatrix[i]];
  
      for (let j = i + 1; j < size * 2; j++) {
        augmentedMatrix[i][j] /= augmentedMatrix[i][i];
      }
  
      for (let j = 0; j < size; j++) {
        if (j !== i) {
          const factor = augmentedMatrix[j][i];
          for (let k = i; k < size * 2; k++) {
            augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
          }
        }
      }
    }
  
    return augmentedMatrix.map(row => row.slice(size));
}

// Koefisien regresi
function multipleLinearRegression(X, y) {
    const XT = transpose(X);
    const XT_X = multiply(XT, X);
    const XT_X_inv = inverse(XT_X);
    const XT_y = multiply(XT, y);
    const beta = multiply(XT_X_inv, XT_y);
  
    return beta;
}

function createObject(keys, values) {
    const obj = Object.fromEntries(
        keys.map((key, index) => [key, values[index]]),
    );
    return obj;
}

const sheetDataHandler = (sheetData) => {
    tabNavi.style.display = "block";

    // Ekstrak data inflasi
    let infbps = sheetData.map(y=>y.inflasi).filter((e) => e != "");
    
    // Prediksi bulan lalu
    let predRilis = sheetData.map(p => p.pred).filter((e) => e != null);
    
    // Jika inflasi bulan lalu blm rilis
    if (infbps.length != 11) {
        tabMenu[0].classList.add("aktif");
        tabPrediksi.classList.add("murup");
        // komLeading.removeAttribute("style"); // gausah ditampilkan klo blm rilis
        predSkrg.innerHTML = "-"
        predBlnSblm.innerHTML = "-"
        rilisBlnSblm.innerHTML = "-"
        let blnBefore = new Date().getMonth();
    
        if (blnBefore == 4) {
            blnSblmPred.innerHTML = `April ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `April ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Mei ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 5) {
            blnSblmPred.innerHTML = `Mei ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Mei ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Juni ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 6) {
            blnSblmPred.innerHTML = `Juni ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Juni ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Juli ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 7) {
            blnSblmPred.innerHTML = `Juli ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Juli ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Agustus ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 8) {
            blnSblmPred.innerHTML = `Agustus ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Agustus ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} September ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 9) {
            blnSblmPred.innerHTML = `September ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `September ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Oktober ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 10) {
            blnSblmPred.innerHTML = `Oktober ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Oktober ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} November ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 11) {
            blnSblmPred.innerHTML = `November ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `November ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Desember ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 12) {
            blnSblmPred.innerHTML = `Desember ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Desember ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Januari ${new Date(). getFullYear()}`;
        }
        
        // Untuk Menampilkan Berita Full Komoditas & Jatim (dari periode terpilih)
        filterBerita();
        
        // Tampilkan juga grafik momentum dan sentimennya di TAB GRAFIK
        filterMomentum();

        // Biar center
        tab_Nav(1);
        tab_Nav(0);
        
        swal.fire({
            title: "Data Belum Lengkap!",
            text: "Data Inflasi Bulan Lalu Belum Rilis. Silakan Gulir ke Bawah Untuk Melihat Fenomena Pendukung",
            icon: "info"
        });
    } else {
        
        // Data untuk pemodelan
        sheetData.forEach((v) => {
          delete v.inflasi;
        });
        
    
        // Komoditas unik dan id-nya
        let idKomoditas = [... new Set(sheetData.map(x=>x.id))];
        let komoditasUnik = [... new Set(sheetData.map(x=>x.komoditas))];
        let psgKomoditas = createObject(komoditasUnik, idKomoditas)
        
        // Grouping data berdasarkan komoditas dan ambil perubahan harganya
        let perubAllKomoditas = []
        komoditasUnik.forEach((k) => {
          let perubPerKomoditas = sheetData.filter(function(s) {
            return s.komoditas == k && s.konversi != `1 - ${new Date().getMonth()+1} - ${new Date().getFullYear()}`;
          }).map(x=>x.pct_change);
          perubAllKomoditas.push(perubPerKomoditas);
        });
        
        // Objek berpasangan antara komoditas dan persentase perubahan harganya
        const perubKomoditas = createObject(komoditasUnik, perubAllKomoditas);
    
        // Menghitung korelasi
        let data = [];
        let korelasi = [];
        let dataVars = {
            x: 'metric',
            y: 'metric'
        }
    
        komoditasUnik.forEach((k) => {
            for (let i = 0; i < perubKomoditas[k].length; i++) {
                data.push({
                    'x': perubKomoditas[k][i],
                    'y': infbps[i]
                });
            }
            
            let stats = new Statistics(data, dataVars);
            let r = stats.correlationCoefficient('x', 'y').correlationCoefficient;
            korelasi.push(r);
            data = [];
        });
        
        // Konversi semua korelasi ke nilai absolut
        let absKorelasi = korelasi.map((r) => Math.abs(r));
    
        // Objek berpasangan antara komoditas dengan nilai absolut korelasinya
        let psgKorelasiAbsolut = createObject(komoditasUnik, absKorelasi);
        let psgKorelasiAsli = createObject(komoditasUnik, korelasi);
        
        // Urutkan 5 terbesar absolut korelasi
        let urutKorelasi = absKorelasi.sort((a,b) => b-a).slice(0,5);
    
        // 5 komoditas yg berpengaruh
        let komoditasPengaruh = urutKorelasi.map((k) => getKeyByValue(psgKorelasiAbsolut, k));
        
        // Nilai korelasi ASLI dari 5 komoditas tsb
        let korelasiMasukModel = komoditasPengaruh.map((e) => psgKorelasiAsli[e]);
        
        // MENENTUKAN MODEL REGRESI
        let matriksSatu = [];
        let i = 0;
        while (i < 11) { // menggunakan periode 10 bulan (ada 11 observasi)
            matriksSatu.push(1);
            i++;
        }
        
        // Matriks X transpose
        const XT = [matriksSatu];
        komoditasPengaruh.forEach((v) => {
            XT.push(perubKomoditas[v]);
        });
        
        // Regresikan
        const beta = multipleLinearRegression(transpose(XT), transpose([infbps]));
        let koef = beta.map((b) => b[0]);
        
        
        // Dapatkan data dari keempat komoditas (urut berdasarkan koef. regresi)
        let dataSeriesKomoditasPengaruh = [];
        komoditasPengaruh.forEach((k) => {
          let dataSeriesPred = sheetData.filter(function(s) {
            return s.komoditas == k;
          }).map(x=>x.pct_change);
          dataSeriesKomoditasPengaruh.push(dataSeriesPred);
        });
    
        // Function untuk menghitung prediksi
        function ycap(k,x) {
          let hasil = k[0];
          for (let i = 1; i < k.length; i++) {
            hasil += k[i]*x[i-1];
          }
          return hasil;
        }
        
        // Dapatkan perub harga bulan ini dari 5 komoditas yg berpengaruh thd inflasi
        let dataHitung = dataSeriesKomoditasPengaruh.map((k) => k[11]);
        
        // Menghitung prediksi inflasi bulan ini
        let predNow = ycap(koef, dataHitung)
        console.log(`Prediksi inflasi di Jatim pada bulan ini adalah ${predNow}`)
    
        // Dapatkan observasi ke-1 sampai ke-11 dari series komoditasPengaruh
        let dataHitungAkurasi = [];
        let dataSeriesPred = [];
        for (let i = 0; i < dataSeriesKomoditasPengaruh[0].length-1; i++) {
          for (let j = 0; j < komoditasPengaruh.length; j++) {
            dataSeriesPred.push(dataSeriesKomoditasPengaruh[j][i])
          }
          dataHitungAkurasi.push(dataSeriesPred);
          dataSeriesPred = [];
        }
    
        // Data prediksi 11 bulan terakhir
        let seriesPred = dataHitungAkurasi.map((a) => ycap(koef,a));
        
        // Selisih kuadrat
        let selisihKuadrat = [];
        for (let i = 0; i < seriesPred.length; i++) {
          selisihKuadrat.push(Math.pow((infbps[i] - seriesPred[i]), 2));
        }
        
        // Menghitung RMSE
        // sqrt(mean((pred-aktual)^2))
        let rmse = Math.sqrt(selisihKuadrat.reduce((a,b)=>a+b)/selisihKuadrat.length)
        console.log(`RMSE = ${rmse}`)
    
        // Menghitung MAPE
        // mean(abs((pred-aktual)/aktual)) * 100
        let selisihAbsolut = [];
        for (let i = 0; i < seriesPred.length; i++) {
          selisihAbsolut.push( Math.abs(infbps[i]-seriesPred[i])/infbps[i] );
        }
    
        let mape = selisihAbsolut.reduce((a,b)=>a+b) / selisihAbsolut.length * 100
        console.log(`MAPE = ${mape}`)
    
        // Ketika TOMBOL ANALISA DIKLIK, list komoditas diambil dari komoditasPengaruh
        for (let i = 0; i < komoditasPengaruh.length; i++) {
            let commodities = document.createElement('option');
            commodities.value = psgKomoditas[komoditasPengaruh[i]];
            commodities.setAttribute("jenis", komoditasPengaruh[i].split(" ")[0].toLowerCase());

            let komPengaruhTemp;
            if (komoditasPengaruh[i].includes(" (")) {
                komPengaruhTemp = komoditasPengaruh[i].split(" /")[0].split(" (")[0];
            } else {
                komPengaruhTemp = komoditasPengaruh[i].split(" /")[0];
            }
            commodities.innerText = komPengaruhTemp;
            bapo.appendChild(commodities);
        }
    
        // Tampilkan prediksi bulan ini, komoditas leading beserta nilai korelasi aslinya
        // Di Tab PREDIKSI
        tabMenu[0].classList.add("aktif");
        tabPrediksi.classList.add("murup");
        
        let blnBefore = new Date().getMonth();
        
        if (blnBefore == 4) {
            blnSblmPred.innerHTML = `April ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `April ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Mei ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 5) {
            blnSblmPred.innerHTML = `Mei ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Mei ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Juni ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 6) {
            blnSblmPred.innerHTML = `Juni ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Juni ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Juli ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 7) {
            blnSblmPred.innerHTML = `Juli ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Juli ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Agustus ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 8) {
            blnSblmPred.innerHTML = `Agustus ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Agustus ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} September ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 9) {
            blnSblmPred.innerHTML = `September ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `September ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Oktober ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 10) {
            blnSblmPred.innerHTML = `Oktober ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Oktober ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} November ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 11) {
            blnSblmPred.innerHTML = `November ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `November ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Desember ${new Date(). getFullYear()}`;
        }
        if (blnBefore == 12) {
            blnSblmPred.innerHTML = `Desember ${new Date(). getFullYear()}`;
            blnSblmRilis.innerHTML = `Desember ${new Date(). getFullYear()}`;
            blnSkrgPred.innerHTML = `${new Date(). getDate()} Januari ${new Date(). getFullYear()}`;
        }
        
        predBlnSblm.innerHTML = predRilis.toString().replace(".", ",");
        rilisBlnSblm.innerHTML = infbps[10].toString().replace(".", ",");
        predSkrg.innerHTML = predNow.toFixed(3).replace(".", ",");

        komLeading.setAttribute("style", "display: block;");
        komLeadingKor.innerHTML = `Korelasi = ${korelasiMasukModel[2].toFixed(3).replace(".", ",")}`;
    
        // Komoditas leading
            for (let i = 0; i < komoditasPengaruh.length; i++) {
                let div = document.createElement("div");
                div.className = "item";
                let komSementara;
                if (komoditasPengaruh[i].includes(" (")) {
                    komSementara = komoditasPengaruh[i].split(" /")[0].split(" (")[0];
                } else {
                    komSementara = komoditasPengaruh[i].split(" /")[0];
                }
                div.innerHTML = `<p style="text-align: center; justify-content: center;">${komSementara}</p>`;
                box.appendChild(div);
            }
    
            let warna = ['#cb4af7', 'orange', '#ff6464', '#5b85ff', '#129014'];
    
            let bg = document.querySelectorAll(".item");
            for (let i = 0; i < bg.length; i++) {
                bg[i].style.background = warna[i];
            }
    
            let idx = 3;
            function moveNext() {
                let items = document.querySelectorAll(".item");
                box.appendChild(items[0]);
                
                komLeadingKor.innerHTML = `Korelasi = ${korelasiMasukModel[idx++ % korelasiMasukModel.length].toFixed(3).replace(".", ",")}`;
                komLeadingKor.style.color = items[3].style.background;
                komLeading.style.fontWeight = "bold";
            }
            moveNext(); moveNext(); moveNext();
    
            box.addEventListener('click', () => moveNext());
            
            // Untuk Menampilkan Berita Full Komoditas & Jatim (dari periode terpilih)
            filterBerita();
            
            // Tampilkan juga grafik momentum dan sentimennya di TAB GRAFIK
            filterMomentum();
    }
    
}

function analisa() {
    // Gunakan mulai dari 11 bulan ke belakang (untuk pemodelan) sampai tgl 1 Bulan ini (untuk prediksi)
    let mundur11Bln = new Date();
    mundur11Bln.setMonth(mundur11Bln.getMonth() - 11);

    // Jika skrg tgl 31
    let mundur12Bln = new Date();
    mundur12Bln.setMonth(mundur12Bln.getMonth() - 12);
    mundur12Bln.setDate(mundur12Bln.getDate() + 1);

    let blnMundur11;
    if (mundur11Bln.getMonth()+1 < 11) {
        blnMundur11 = `0${mundur11Bln.getMonth()+1}`;
    } else {
        blnMundur11 = mundur11Bln.getMonth()+1;
    }

    let now = new Date();
    let blnSkrg;
    if (now.getMonth()+1 < 10) {
        blnSkrg = `0${now.getMonth()+1}`;
    } else {
        blnSkrg = now.getMonth()+1;
    }

    if (analyze.value == "off") {
        analyze.value = "on";
        analyze.innerHTML = "Reset";

        if (now.getDate() == 31) {
            getSheetData({
                sheetName: "Bulanan",
                query: `SELECT A,B,C,D,F,G,H WHERE C >= date '${mundur12Bln.getFullYear()}-${mundur12Bln.getMonth()+1}-1' AND C <= date '${now.getFullYear()}-${blnSkrg}-1'`,
                callback: sheetDataHandler
            });
        } else {
            getSheetData({
                sheetName: "Bulanan",
                query: `SELECT A,B,C,D,F,G,H WHERE C >= date '${mundur11Bln.getFullYear()}-${blnMundur11}-1' AND C <= date '${now.getFullYear()}-${blnSkrg}-1'`,
                callback: sheetDataHandler
            });
        }

        notif("Berhasil Memproses Data", "success", "");
        
    }
    else {
        localStorage.clear(); // full hard refresh
        location.reload() // refresh page
    }
    
}