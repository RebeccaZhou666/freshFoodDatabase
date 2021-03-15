// const foodCategory;
// const foodDuration;
// const foodForm;


window.addEventListener("DOMContentLoaded", setup);



// const html5QrCode = new Html5Qrcode(/* element id */ "reader");

// // File based scanning
// const fileinput = document.getElementById('qr-input-file');
// fileinput.addEventListener('change', e => {
//     if (e.target.files.length == 0) {
//         // No file selected, ignore 
//         return;
//     }

//     // Use the first item in the list
//     const imageFile = e.target.files[0];
//     html5QrCode.scanFile(imageFile, /* showImage= */true)
//         .then(qrCodeMessage => {
//             // success, use qrCodeMessage
//             console.log(qrCodeMessage);
//         })
//         .catch(err => {
//             // failure, handle it.
//             console.log(`Error scanning file. Reason: ${err}`)
//         });
// });


function setup() {
    // fetchData();
    getCurrentCat();
    // postData();
}

async function getCurrentCat() {
    const res = await fetch("/category");
    const data = await res.json();
    console.log(data)
    // insert data into list

    fillCategory(data);
}

function fillCategory(data) {
    let foodCat = document.getElementById("catgrid");

    data.forEach(e => {
        //foodblock div
        var div_foodblock = document.createElement('div');
        div_foodblock.setAttribute('class', 'foodblock');

        //img food category
        var div_imgWrapper = document.createElement('div');
        div_imgWrapper.setAttribute('class', 'imagefoodwrapper');

        var img_food_category = document.createElement('img');
        img_food_category.setAttribute('width', '32px');
        img_food_category.setAttribute('height', '32px');
        img_food_category.setAttribute('class', 'foodimg');

        var h6_index = document.createElement('h6');
        h6_index.setAttribute('class', 'heading-6');

        div_imgWrapper.appendChild(img_food_category);
        div_foodblock.appendChild(div_imgWrapper);
        div_foodblock.appendChild(h6_index);
        foodCat.appendChild(div_foodblock);


        img_food_category.setAttribute('src', e.src);
        img_food_category.setAttribute('id', e._id);
        img_food_category.setAttribute('name', e.Name);
        h6_index.innerHTML = e.Name;
    })


}


$("#submit").click(function (e) {
    e.preventDefault();
    console.log("click");
    // get data
    const foodDay = $("#Day")[0].value == "" ? 0 : parseInt($("#Day")[0].value);
    const foodMonth = $("#Month")[0].value == "" ? 0 : parseInt($("#Month")[0].value);

    console.log(foodDay, foodMonth)

    const duration = getDuration(foodDay, foodMonth);
    let cat = $('#' + currId).attr('name');

    $("#Day")[0].value = 0;
    $("#Month")[0].value = 0;

    // send info to the database
    fetch("/send",
        {
            method: "POST",
            body: JSON.stringify(
                {
                    Category: cat,
                    Duration: duration,
                }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        .then(res => res.json()).then((data) => {
            window.location = "/main";
        });
});

function getDuration(day, month) {
    return day + month * 30;
}



// click category

var arrayWithElements = new Array();
let prevId = '-1';
let currId = '-1';
let catName;

function clickListener(e) {
    var clickedElement = (window.event)
        ? window.event.toElement
        : e.target,

        tags = document.getElementsByClassName('foodimg');

    for (var i = 0; i < tags.length; i++) {
        if (tags[i] == clickedElement) {
            // arrayWithElements.push({ tag: clickedElement.toElement.id, index: i });
            currId = tags[i].id;
            catName = clickedElement.name;
            console.log(tags[i].id, prevId);
            if (prevId != tags[i].id) {
                if (prevId == '-1') {
                } else {
                    var prevChosenBlock = document.getElementById(prevId.toString())
                    prevChosenBlock.parentElement.parentElement.classList.remove('chosen');
                }
                clickedElement.parentElement.parentElement.classList.add('chosen');
            } else {
                clickedElement.parentElement.parentElement.classList.remove('chosen');
            }
            prevId = tags[i].id;
        }
    }

    console.log('click');
}

document.onclick = clickListener;