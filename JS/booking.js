const carDatabase = {
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "R8", "TT", "e-tron", "e-tron GT", "RS3", "RS4", "RS5", "RS6", "RS7", "RS Q3", "RS Q8"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "XM", "Z4", "i3", "i4", "iX", "iX1", "iX3", "i7", "M2", "M3", "M4", "M5", "M8"],
    "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "CLE", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQA", "EQB", "EQC", "EQE", "EQS", "AMG GT", "SL", "SLK", "V-Class"],
    "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "T-Roc", "T-Cross", "Taigo", "Arteon", "Touran", "Sharan", "Scirocco", "Beetle", "Up!", "ID.3", "ID.4", "ID.5", "ID.Buzz"],
    "Porsche": ["911", "718 Boxster", "718 Cayman", "Panamera", "Macan", "Cayenne", "Taycan", "918 Spyder"],
    "Tesla": ["Model S", "Model 3", "Model X", "Model Y", "Cybertruck", "Roadster"],
    "Volvo": ["S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90", "C40", "EX30", "EX90"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
    "Toyota": ["Aygo", "Yaris", "Corolla", "Camry", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Supra", "Prius", "bZ4X"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mondeo", "Mustang", "Mustang Mach-E", "Explorer", "Bronco"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco", "Mii"],
    "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq iV"],
    "Cupra": ["Born", "Formentor", "Leon", "Ateca", "Tavascan"],
    "Renault": ["Clio", "Captur", "Megane", "Arkana", "Austral", "Espace", "Twingo", "Zoe", "Scenic"],
    "Peugeot": ["208", "2008", "308", "3008", "408", "508", "5008", "Rifter"],
    "Citroen": ["C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo"],
    "Hyundai": ["i10", "i20", "i30", "IONIQ 5", "IONIQ 6", "Kona", "Tucson", "Santa Fe", "Bayon"],
    "Kia": ["Picanto", "Rio", "Ceed", "XCeed", "Niro", "Sportage", "Sorento", "EV6", "EV9", "Stonic"],
    "Mini": ["Cooper", "Cooper S", "Clubman", "Countryman", "Paceman"],
    "Fiat": ["500", "500X", "500e", "Panda", "Tipo"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "MiTo"],
    "Jaguar": ["XE", "XF", "XJ", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
    "Lamborghini": ["Urus", "Huracan", "Aventador", "Revuelto"],
    "Ferrari": ["Roma", "Portofino", "F8", "296 GTB", "812 Superfast", "SF90", "Purosangue"],
    "Aston Martin": ["Vantage", "DB11", "DBS", "DBX", "Valhalla", "Valkyrie"],
    "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
    "Rolls-Royce": ["Phantom", "Ghost", "Wraith", "Dawn", "Cullinan", "Spectre"],
    "Maserati": ["Ghibli", "Levante", "Quattroporte", "Grecale", "MC20"],
    "Polestar": ["Polestar 2", "Polestar 3", "Polestar 4"],
    "Lynk & Co": ["01"],
    "Mazda": ["2", "3", "6", "CX-30", "CX-5", "CX-60", "MX-5"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Ariya", "Leaf", "GT-R"],
    "Suzuki": ["Swift", "Ignis", "Vitara", "S-Cross", "Swace", "Across"],
    "RAM": ["1500", "2500", "TRX"]
};

const allBrandsList = Object.keys(carDatabase).sort();

const serviceOptionsDB = {
    'ambient': { title: "Ambient Light" },
    'tuning': { title: "Chip Tuning" },
    'bodykits': { title: "Bodykits" },
    'starroof': { title: "Starroof" },
    'rims': { title: "Rim Painting" },
    'wraps': { title: "Vehicle Wraps" },
    'seatbelts': { title: "Custom Seatbelts" },
    'upholstery': { title: "Interior Upholstery" },
    'calipers': { title: "Brake Calipers" },
    'steering': { title: "Steering Wheels" },
    'parts': { title: "Parts Installation" }
};

let bookingData = {
    step: 1,
    car: { brand: '', model: '', year: '' },
    selectedServices: [],
    specificOptions: [],
    customerType: 'private',
    customer: {},
    totalPrice: 0
};

document.addEventListener('DOMContentLoaded', () => {
    initSearchDropdown();
    setupInputMasks();

    document.addEventListener('click', function(e) {
        if(!e.target.closest('.input-container')) {
            document.querySelectorAll('.config-dropdown').forEach(d => d.classList.remove('show'));
        }
    });
});



function selectBrand(brandName, element) {
    document.querySelectorAll('.brand-pill').forEach(b => b.classList.remove('active'));
    if(element) element.classList.add('active');
    
    const searchInput = document.getElementById('brand-search');
    searchInput.value = brandName;
    document.getElementById('car-brand').value = brandName;
    
    document.getElementById('brand-dropdown').classList.remove('show');
    resetModelStep();
    loadModelsForBrand(brandName);
}

function initSearchDropdown() {
    const dropdown = document.getElementById('brand-dropdown');
    if(!dropdown) return;
    dropdown.innerHTML = '';
    
    allBrandsList.forEach(brand => {
        const div = document.createElement('div');
        div.className = 'config-item';
        div.innerText = brand;
        div.onclick = () => selectBrand(brand, null);
        dropdown.appendChild(div);
    });
}

function showBrandList() {
    const dropdown = document.getElementById('brand-dropdown');
    const input = document.getElementById('brand-search');
    if(input.value.trim() === "") {
        dropdown.querySelectorAll('.config-item').forEach(item => item.style.display = "");
    }
    dropdown.classList.add('show');
}

function filterBrandList(input) {
    const filter = input.value.toUpperCase();
    const dropdown = document.getElementById('brand-dropdown');
    if(!dropdown.classList.contains('show')) showBrandList();
    
    const items = dropdown.querySelectorAll('.config-item');
    items.forEach(item => {
        item.style.display = item.innerText.toUpperCase().includes(filter) ? "" : "none";
    });
    document.getElementById('car-brand').value = input.value;
}

function loadModelsForBrand(brand) {
    const modelSection = document.getElementById('section-model');
    const modelInput = document.getElementById('model-search');
    const icon = document.getElementById('model-icon');
    
    modelSection.classList.remove('disabled');
    modelInput.disabled = false;
    modelInput.value = '';
    
    let models = carDatabase[brand];
    if (!models) {
        const key = Object.keys(carDatabase).find(k => k.toUpperCase() === brand.toUpperCase());
        if (key) models = carDatabase[key];
    }

    const dropdown = document.getElementById('model-dropdown');
    dropdown.innerHTML = '';

    if (models && models.length > 0) {
        modelInput.placeholder = "Selecteer Model";
        icon.innerText = "🚗";
        models.forEach(model => {
            const div = document.createElement('div');
            div.className = 'config-item';
            div.innerText = model;
            div.onclick = () => selectModel(model);
            dropdown.appendChild(div);
        });
        modelInput.dataset.list = JSON.stringify(models);
        if(document.activeElement === modelInput) showModelList();
    } else {
        modelInput.placeholder = "Typ model handmatig...";
        icon.innerText = "✍️";
        modelInput.dataset.list = "[]";
    }
}

function showModelList() {
    const input = document.getElementById('model-search');
    const dropdown = document.getElementById('model-dropdown');
    
    if (!input.dataset.list) return;
    const models = JSON.parse(input.dataset.list);
    if(models.length === 0) return;

    if(input.value.trim() === "") {
        dropdown.querySelectorAll('.config-item').forEach(item => item.style.display = "");
    } else {
        filterModelList(input);
        return; 
    }
    dropdown.classList.add('show');
}

function selectModel(modelName) {
    document.getElementById('model-search').value = modelName;
    document.getElementById('car-model').value = modelName;
    document.getElementById('model-dropdown').classList.remove('show');
    initYearConfigurator();
}

function filterModelList(input) {
    const filter = input.value.toUpperCase();
    const dropdown = document.getElementById('model-dropdown');
    document.getElementById('car-model').value = input.value;

    if (!input.dataset.list) return;
    const models = JSON.parse(input.dataset.list);
    if(models.length === 0) return;

    dropdown.innerHTML = '';
    const filtered = models.filter(m => m.toUpperCase().includes(filter));
    
    if(filtered.length > 0) {
        dropdown.classList.add('show');
        filtered.forEach(model => {
            const div = document.createElement('div');
            div.className = 'config-item';
            div.innerText = model;
            div.onclick = () => selectModel(model);
            dropdown.appendChild(div);
        });
    } else {
        dropdown.classList.remove('show');
    }
}

function initYearConfigurator() {
    const yearSection = document.getElementById('section-year');
    const yearGrid = document.getElementById('year-grid');
    yearSection.classList.remove('disabled');
    yearGrid.innerHTML = '';
    
    for(let y = 2026; y >= 1990; y--) {
        const div = document.createElement('div');
        div.className = 'year-btn';
        div.innerText = y;
        div.onclick = function() {
            document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('car-year').value = y;
            bookingData.car.year = y; 
        };
        yearGrid.appendChild(div);
    }
}

function resetModelStep() {
    document.getElementById('section-model').classList.add('disabled');
    document.getElementById('section-year').classList.add('disabled');
    document.getElementById('model-search').value = '';
    document.getElementById('model-search').disabled = true;
    document.getElementById('car-model').value = '';
    document.getElementById('car-year').value = '';
    document.getElementById('model-icon').innerText = '🚗';
    document.getElementById('model-search').dataset.list = "[]";
    document.getElementById('model-dropdown').innerHTML = "";
}


window.toggleService = function(card) {
    card.classList.toggle('selected');
    const val = card.dataset.value;
    if(card.classList.contains('selected')) bookingData.selectedServices.push(val);
    else bookingData.selectedServices = bookingData.selectedServices.filter(s => s !== val);
};

function renderDynamicOptions() {
    const wrapper = document.getElementById('dynamic-options-container');
    wrapper.innerHTML = '';
    
    bookingData.selectedServices.forEach(srvId => {
        const data = serviceOptionsDB[srvId];
        const html = `
            <div class="dynamic-service-block" style="padding: 20px; display:flex; align-items:center;">
                <div class="dynamic-service-title" style="margin:0; font-size:16px;">${data.title}</div>
            </div>`;
        wrapper.innerHTML += html;
    });
    
    document.getElementById('total-price-display').innerText = "Op aanvraag";
}

window.calcTotal = function() {

};

window.nextStep = function(step) {
    if(step === 1) {
        const brand = document.getElementById('car-brand').value;
        const model = document.getElementById('car-model').value;
        const year = document.getElementById('car-year').value;
        
        if(!brand) return alert('Kies eerst een merk.');
        if(!model) return alert('Kies of typ een model.');
        
        bookingData.car.brand = brand;
        bookingData.car.model = model;
        if(year) bookingData.car.year = year;
    }

    if(step === 2 && bookingData.selectedServices.length === 0) return alert('Kies minstens één dienst.');
    
    if(step === 2) renderDynamicOptions();
    
    if(step === 4) {
        if(!validateContactForm()) return;
        generateReview();
    }

    if(step < 5) {
        document.getElementById(`step-${step}`).classList.remove('active');
        document.getElementById(`step-${step+1}`).classList.add('active');
        updateProgress(step + 1);
        window.scrollTo(0,0);
    }
};

window.prevStep = function(step) {
    document.getElementById(`step-${step}`).classList.remove('active');
    document.getElementById(`step-${step-1}`).classList.add('active');
    updateProgress(step - 1);
};

function updateProgress(step) {
    document.querySelectorAll('.step-indicator').forEach(el => {
        el.classList.remove('active');
        if(parseInt(el.dataset.step) === step) el.classList.add('active');
    });
}

function setupInputMasks() {
    const phoneInput = document.getElementById('phone');
    const plateInput = document.getElementById('license-plate');
    if(phoneInput) {
        phoneInput.addEventListener('focus', () => { if(!phoneInput.value) phoneInput.value = "+31 6 "; });
        phoneInput.addEventListener('input', (e) => {
            let val = phoneInput.value;
            if(!val.startsWith("+31 6 ")) phoneInput.value = "+31 6 " + val.replace(/\D/g,'').replace(/^316/,'');
            const prefix = "+31 6 ";
            const numbers = val.substring(prefix.length).replace(/[^0-9]/g, '');
            phoneInput.value = prefix + numbers.substring(0, 8); 
        });
    }
    if(plateInput) {
        plateInput.addEventListener('input', (e) => {
            let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if(val.length > 6) val = val.substring(0, 6);
            e.target.value = val;
        });
    }
}

function validateContactForm() {
    let isValid = true;
    document.querySelectorAll('.input-group input').forEach(i => i.style.borderColor = 'rgba(255,255,255,0.1)');
    const requiredIds = ['first-name', 'last-name', 'email', 'phone', 'license-plate'];
    if(bookingData.customerType === 'business') requiredIds.push('company-name', 'vat-number', 'kvk-number');
    requiredIds.forEach(id => {
        const el = document.getElementById(id);
        if(!el.value.trim()) {
            el.style.borderColor = '#FF0000';
            isValid = false;
        }
    });
    return isValid;
}

window.setCustomerType = function(type, btn) {
    document.querySelectorAll('.type-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    bookingData.customerType = type;
    document.querySelectorAll('.business-field').forEach(f => f.style.display = type === 'business' ? 'block' : 'none');
};

function generateReview() {
    document.getElementById('review-car').innerText = `${bookingData.car.brand} ${bookingData.car.model} (${bookingData.car.year || '?'})`;
    document.getElementById('review-total').innerText = "Op aanvraag";
    
    const contactHtml = `${document.getElementById('first-name').value} ${document.getElementById('last-name').value} <br> ${document.getElementById('email').value} <br> ${document.getElementById('phone').value} <br> Kenteken: ${document.getElementById('license-plate').value}`;
    document.getElementById('review-contact').innerHTML = contactHtml;
    
    const list = document.getElementById('review-services-list');
    list.innerHTML = '';
    bookingData.selectedServices.forEach(srvId => {
        list.innerHTML += `<li>${serviceOptionsDB[srvId].title}</li>`;
    });
}

window.submitBooking = async function() {
    const btn = document.querySelector('.btn-finish');
    const originalText = btn.innerText;
    
    btn.innerText = "Verwerken...";
    btn.style.opacity = "0.7";
    btn.disabled = true;
    document.body.style.cursor = 'wait';

    let servicesFormatted = "";
    if (bookingData.selectedServices.length > 0) {
        bookingData.selectedServices.forEach(srvId => {
            servicesFormatted += `• ${serviceOptionsDB[srvId].title}\n`;
        });
    } else { 
        servicesFormatted = "Geen diensten geselecteerd"; 
    }

    const formData = {
        "_subject": `Nieuwe Boeking: ${bookingData.car.brand} ${bookingData.car.model}`,
        "_template": "box",
        "_captcha": "false",
        
        "NAAM KLANT": `${document.getElementById('first-name').value} ${document.getElementById('last-name').value}`,
        "EMAIL": document.getElementById('email').value,
        "TELEFOON": document.getElementById('phone').value,
        "KENTEKEN": document.getElementById('license-plate').value,
        "TYPE KLANT": bookingData.customerType === 'business' ? 'Zakelijk' : 'Particulier',
        
        "AUTO MERK": bookingData.car.brand,
        "AUTO MODEL": bookingData.car.model,
        "BOUWJAAR": bookingData.car.year || "Niet opgegeven",
        
        "GEKOZEN DIENSTEN": servicesFormatted,
        "TOTAALPRIJS": "Op aanvraag (Te bespreken)",
        "DATUM AANVRAAG": new Date().toLocaleString('nl-NL')
    };

    if(bookingData.customerType === 'business') {
        formData["BEDRIJFSNAAM"] = document.getElementById('company-name').value || "-";
        formData["BTW NUMMER"] = document.getElementById('vat-number').value || "-";
    }

    try {
        const emailOwner = "danildovgop@gmail.com"; 
        
        const response = await fetch(`https://formsubmit.co/ajax/${emailOwner}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Accept": "application/json" 
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            document.getElementById('step-5').classList.remove('active');
            document.getElementById('step-success').classList.add('active');
            document.querySelector('.progress-bar-wrapper').style.display = 'none';
            window.scrollTo(0, 0);
        } else { 
            throw new Error("Server error"); 
        }

    } catch (error) {
        console.error(error);
        alert("Fout bij verzenden. Probeer later opnieuw.");
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
    } finally { 
        document.body.style.cursor = 'default'; 
    }
};