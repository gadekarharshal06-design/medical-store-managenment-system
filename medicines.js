/* ==========================================
   MEDICINE MANAGEMENT SYSTEM
========================================== */


/* ---------- LOAD DATA ---------- */

let medicines =
    JSON.parse(
        localStorage.getItem("medicalMedicines")
    ) || [];


/* ---------- DISPLAY MEDICINES ---------- */

function displayMedicines() {

    const table =
        document.getElementById("medicineTable");

    const search =
        document
            .getElementById("searchMedicine")
            .value
            .toLowerCase();

    const category =
        document.getElementById("categoryFilter")
            .value;


    table.innerHTML = "";


    let filtered =
        medicines.filter(function(medicine) {

            const searchMatch =
                medicine.name
                    .toLowerCase()
                    .includes(search)

                ||

                medicine.company
                    .toLowerCase()
                    .includes(search)

                ||

                medicine.batch
                    .toLowerCase()
                    .includes(search);


            const categoryMatch =
                category === "" ||
                medicine.category === category;


            return searchMatch && categoryMatch;

        });


    filtered.forEach(function(medicine) {

        const row =
            document.createElement("tr");


        const status =
            getMedicineStatus(medicine);


        row.innerHTML = `

            <td>
                ${medicine.id}
            </td>


            <td>
                <strong>
                    ${medicine.name}
                </strong>
            </td>


            <td>
                ${medicine.category}
            </td>


            <td>
                ${medicine.company}
            </td>


            <td>
                ${medicine.batch}
            </td>


            <td>
                ${medicine.expiry}
            </td>


            <td>
                ₹${Number(
                    medicine.purchasePrice
                ).toFixed(2)}
            </td>


            <td>
                ₹${Number(
                    medicine.sellingPrice
                ).toFixed(2)}
            </td>


            <td>
                ${medicine.quantity}
            </td>


            <td>
                <span class="status ${status.class}">
                    ${status.text}
                </span>
            </td>


            <td>

                <button
                    class="action-btn edit"
                    onclick="editMedicine(${medicine.id})"
                >
                    ✏️
                </button>


                <button
                    class="action-btn delete"
                    onclick="deleteMedicine(${medicine.id})"
                >
                    🗑️
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    document.getElementById(
        "medicineCount"
    ).innerText =
        filtered.length + " medicines";


    updateStatistics();

}


/* ---------- MEDICINE STATUS ---------- */

function getMedicineStatus(medicine) {

    const today =
        new Date();


    const expiry =
        new Date(
            medicine.expiry
        );


    if (expiry < today) {

        return {
            text: "Expired",
            class: "expired"
        };

    }


    const difference =
        expiry - today;


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    if (days <= 30) {

        return {
            text: "Expiring Soon",
            class: "soon"
        };

    }


    if (
        Number(medicine.quantity)
        <=
        Number(medicine.minimumStock)
    ) {

        return {
            text: "Low Stock",
            class: "low"
        };

    }


    return {
        text: "Available",
        class: "good"
    };

}


/* ---------- OPEN FORM ---------- */

function openMedicineForm() {

    document
        .getElementById("medicineModal")
        .classList.add("show");


    document
        .getElementById("formTitle")
        .innerText =
        "Add Medicine";


    document
        .getElementById("medicineForm")
        .reset();


    document
        .getElementById("medicineId")
        .value = "";

}


/* ---------- CLOSE FORM ---------- */

function closeMedicineForm() {

    document
        .getElementById("medicineModal")
        .classList.remove("show");

}


/* ---------- SAVE MEDICINE ---------- */

function saveMedicine(event) {

    event.preventDefault();


    const id =
        document.getElementById(
            "medicineId"
        ).value;


    const medicine = {

        id:
            id
                ? Number(id)
                : Date.now(),


        name:
            document.getElementById(
                "medicineName"
            ).value.trim(),


        category:
            document.getElementById(
                "medicineCategory"
            ).value,


        company:
            document.getElementById(
                "company"
            ).value.trim(),


        supplier:
            document.getElementById(
                "supplier"
            ).value.trim(),


        batch:
            document.getElementById(
                "batchNumber"
            ).value.trim(),


        expiry:
            document.getElementById(
                "expiryDate"
            ).value,


        purchasePrice:
            Number(
                document.getElementById(
                    "purchasePrice"
                ).value
            ),


        sellingPrice:
            Number(
                document.getElementById(
                    "sellingPrice"
                ).value
            ),


        quantity:
            Number(
                document.getElementById(
                    "quantity"
                ).value
            ),


        minimumStock:
            Number(
                document.getElementById(
                    "minimumStock"
                ).value
            ),


        description:
            document.getElementById(
                "description"
            ).value.trim()

    };


    /* Check selling price */

    if (
        medicine.sellingPrice <
        medicine.purchasePrice
    ) {

        const confirmPrice =
            confirm(
                "Selling price is lower than purchase price. Continue?"
            );


        if (!confirmPrice) {

            return;

        }

    }


    /* EDIT */

    if (id) {

        const index =
            medicines.findIndex(
                function(item) {

                    return item.id === Number(id);

                }
            );


        medicines[index] =
            medicine;

    }


    /* ADD */

    else {

        medicines.push(
            medicine
        );

    }


    saveData();


    displayMedicines();


    closeMedicineForm();


    alert(
        id
            ? "Medicine updated successfully!"
            : "Medicine added successfully!"
    );

}


/* ---------- EDIT MEDICINE ---------- */

function editMedicine(id) {

    const medicine =
        medicines.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!medicine) {

        return;

    }


    document.getElementById(
        "medicineId"
    ).value =
        medicine.id;


    document.getElementById(
        "medicineName"
    ).value =
        medicine.name;


    document.getElementById(
        "medicineCategory"
    ).value =
        medicine.category;


    document.getElementById(
        "company"
    ).value =
        medicine.company;


    document.getElementById(
        "supplier"
    ).value =
        medicine.supplier;


    document.getElementById(
        "batchNumber"
    ).value =
        medicine.batch;


    document.getElementById(
        "expiryDate"
    ).value =
        medicine.expiry;


    document.getElementById(
        "purchasePrice"
    ).value =
        medicine.purchasePrice;


    document.getElementById(
        "sellingPrice"
    ).value =
        medicine.sellingPrice;


    document.getElementById(
        "quantity"
    ).value =
        medicine.quantity;


    document.getElementById(
        "minimumStock"
    ).value =
        medicine.minimumStock;


    document.getElementById(
        "description"
    ).value =
        medicine.description;


    document.getElementById(
        "formTitle"
    ).innerText =
        "Edit Medicine";


    document
        .getElementById("medicineModal")
        .classList.add("show");

}


/* ---------- DELETE MEDICINE ---------- */

function deleteMedicine(id) {

    const medicine =
        medicines.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!medicine) {

        return;

    }


    const confirmDelete =
        confirm(
            "Delete " +
            medicine.name +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    medicines =
        medicines.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveData();


    displayMedicines();


    alert(
        "Medicine deleted successfully!"
    );

}


/* ---------- SAVE LOCAL STORAGE ---------- */

function saveData() {

    localStorage.setItem(
        "medicalMedicines",
        JSON.stringify(medicines)
    );

}


/* ---------- STATISTICS ---------- */

function updateStatistics() {

    const totalMedicines =
        medicines.length;


    const totalStock =
        medicines.reduce(
            function(total, medicine) {

                return total +
                    Number(
                        medicine.quantity
                    );

            },
            0
        );


    const lowStock =
        medicines.filter(
            function(medicine) {

                return Number(
                    medicine.quantity
                )
                <=
                Number(
                    medicine.minimumStock
                );

            }
        ).length;


    const today =
        new Date();


    const expired =
        medicines.filter(
            function(medicine) {

                return new Date(
                    medicine.expiry
                ) < today;

            }
        ).length;


    document.getElementById(
        "totalMedicines"
    ).innerText =
        totalMedicines;


    document.getElementById(
        "totalStock"
    ).innerText =
        totalStock;


    document.getElementById(
        "lowStock"
    ).innerText =
        lowStock;


    document.getElementById(
        "expiredMedicines"
    ).innerText =
        expired;

}


/* ---------- EXPORT CSV ---------- */

function exportCSV() {

    if (medicines.length === 0) {

        alert(
            "No medicines available."
        );

        return;

    }


    let csv =
        "ID,Medicine,Category,Company,Supplier,Batch,Expiry,Purchase Price,Selling Price,Quantity,Minimum Stock\n";


    medicines.forEach(
        function(medicine) {

            csv +=

                medicine.id + "," +

                `"${medicine.name}",` +

                `"${medicine.category}",` +

                `"${medicine.company}",` +

                `"${medicine.supplier}",` +

                `"${medicine.batch}",` +

                medicine.expiry + "," +

                medicine.purchasePrice + "," +

                medicine.sellingPrice + "," +

                medicine.quantity + "," +

                medicine.minimumStock +

                "\n";

        }
    );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;


    link.download =
        "medicines.csv";


    link.click();


    URL.revokeObjectURL(url);

}


/* ---------- CLOSE MODAL ON OUTSIDE CLICK ---------- */

window.onclick =
    function(event) {

        const modal =
            document.getElementById(
                "medicineModal"
            );


        if (
            event.target === modal
        ) {

            closeMedicineForm();

        }

    };


/* ---------- START ---------- */

displayMedicines();