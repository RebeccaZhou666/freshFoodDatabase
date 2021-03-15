
window.addEventListener("DOMContentLoaded", setup);

function setup() {

    getCurrent();
}

async function getCurrent() {
    const res = await fetch("/current");
    const data = await res.json();
    console.log(data)

    // sort out data by timeleft and split into two zones
    let safeFood = sortFood(true, data);
    let dangerFood = sortFood(false, data);
    // console.log(safeFood);
    // console.log(dangerFood);

    // fill in the results in the list
    fillList(false, dangerFood);
    fillList(true, safeFood);
    console.log(safeFood)

}

function sortFood(isSafe, data) {
    let foodArray = new Array();
    let sortArray = new Array();
    if (!isSafe) {
        // get dangerous food
        data.forEach(e => {
            if (e.TimeLeft < 5) {
                foodArray.push(e);
            }
        })
    } else {
        data.forEach(e => {
            if (e.TimeLeft >= 5) {
                foodArray.push(e);

            }
        })
    }
    foodArray.sort(function (a, b) { return b.TimeLeft >= a.TimeLeft ? -1 : 1 });
    return foodArray;
}

function fillList(isSafe, data) {
    let foodListSafe, foodListDanger;

    if (isSafe) {
        foodListSafe = document.getElementById("safefoodzone");
    } else {
        foodListDanger = document.getElementById("dangerfoodzone");
    }


    data.forEach(e => {
        // create style
        var li = document.createElement('li');

        var div_cardWrapper = document.createElement('div');
        if (isSafe) {
            div_cardWrapper.setAttribute('class', 'cardwrapper safe');
        } else {
            div_cardWrapper.setAttribute('class', 'cardwrapper');
        }

        // delete
        var a_delete = document.createElement('a');
        a_delete.setAttribute('class', 'deletewrapper');
        a_delete.setAttribute('z-index', '10');


        var img_delete = document.createElement('img');
        img_delete.setAttribute('class', 'image-4');
        img_delete.setAttribute('width', '10px');
        img_delete.setAttribute('height', '10px');
        img_delete.setAttribute('src', 'images/cancel.png');

        a_delete.appendChild(img_delete);

        //img category
        var div_imgWrapper = document.createElement('div');
        div_imgWrapper.setAttribute('class', 'imagewrapper');

        var img_category = document.createElement('img');
        img_category.setAttribute('width', '48px');
        img_category.setAttribute('height', '48px');

        div_imgWrapper.appendChild(img_category);

        //info category
        var div_infoWrapper = document.createElement('div');
        div_infoWrapper.setAttribute('class', 'infowrapper');

        var div_upWrapper = document.createElement('div');
        div_upWrapper.setAttribute('class', 'rightupperwrapper');

        var div_textWrapper = document.createElement('div');
        if (isSafe) {
            div_textWrapper.setAttribute('class', 'textwrapper hidden');
        } else {
            div_textWrapper.setAttribute('class', 'textwrapper');
        }


        var h4 = document.createElement('h4');
        h4.setAttribute('class', 'heading-4');

        var p = document.createElement('p');
        p.setAttribute('class', 'paragraph');

        var div_progressWrapper = document.createElement('div');
        div_progressWrapper.setAttribute('class', 'progresswrapper');

        var div_progressWrapperInner = document.createElement('div');
        div_progressWrapperInner.setAttribute('class', 'progresswrapper inner');

        var statusWrapper = document.createElement('div');
        var h6 = document.createElement('h6');
        if (!isSafe) {
            statusWrapper.setAttribute('class', 'statuswrapper');
            h6.setAttribute('class', 'heading-5');
            statusWrapper.appendChild(h6);
        }

        div_textWrapper.appendChild(h4);
        div_textWrapper.appendChild(p);
        div_upWrapper.appendChild(div_textWrapper);
        div_upWrapper.appendChild(statusWrapper);
        div_progressWrapper.appendChild(div_progressWrapperInner);

        div_infoWrapper.appendChild(div_upWrapper);
        div_infoWrapper.appendChild(div_progressWrapper);

        div_cardWrapper.appendChild(a_delete);
        div_cardWrapper.appendChild(div_imgWrapper);
        div_cardWrapper.appendChild(div_infoWrapper);

        li.appendChild(div_cardWrapper);

        // addtional info for danger zone



        // add info
        p.innerHTML = e.Date;
        h4.innerHTML = e.Category;
        img_delete.setAttribute('id', e._id);

        img_category.setAttribute('src', ['images/' + e.Category.toLowerCase() + '.png']);

        var leftTime = e.TimeLeft / e.Duration * 100;
        console.log(leftTime);

        div_progressWrapperInner.setAttribute('id', e._id);
        div_progressWrapperInner.style.width = [leftTime.toString() + '%'];

        if (!isSafe) {
            h6.innerHTML = (e.TimeLeft >= 0) ? (e.TimeLeft.toString() + ' Days Left') : ('OverDue!!!');
        }

        if (e.TimeLeft >= 10) {
            div_progressWrapperInner.style.backgroundColor = "#42b883";
        } else if (e.TimeLeft >= 3 && e.TimeLeft < 10) {
            div_progressWrapperInner.style.backgroundColor = "#f4a261";
        } else {
            div_progressWrapperInner.style.backgroundColor = "#e05e5e";
        }


        if (isSafe) {
            foodListSafe.appendChild(li);
        } else {
            foodListDanger.appendChild(li);
        }


    });
}

// delete data

var arrayWithElements = new Array();

function clickListener(e) {
    var clickedElement = (window.event)
        ? window.event.toElement
        : e.target,

        tags = document.getElementsByClassName('image-4');

    for (var i = 0; i < tags.length; i++) {
        if (tags[i] == clickedElement) {
            // arrayWithElements.push({ tag: clickedElement.toElement.id, index: i });
            // console.log(arrayWithElements);
            console.log(tags[i].id);

            // delete this data

            fetch("/delete",
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            _id: tags[i].id,
                        }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                })
                .then(res => res.json()).then((data) => {
                    window.location = "/main";
                });
        }
    }

    console.log('click');
}

document.onclick = clickListener;


// updates
var now = new Date();
var delay = 20 * 1000; // 1 hour in msec
var start = delay - (now.getMinutes() * 60 + now.getSeconds()) * 1000;


setInterval(function doSomething() {
    // do the operation

    location.reload();
    // schedule the next tick
    setInterval(doSomething, delay);
}, delay);