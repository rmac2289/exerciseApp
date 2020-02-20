/* spoonacular API key and base URL used in both fetches */

const apiKey = 'e665e607a65e442b806a7f9495411f15'
const baseURL = 'https://api.spoonacular.com/'

/* properly formats paramters in fetch request */

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

/* handles display on 'let's get cookin' button click */

function displayIngredient(responseJson) {
    console.log(responseJson);

    if (responseJson.status !== "failure") {
        $('.mainForm').addClass('formWidth');
        $('.formList').addClass('regulateWidth');
        $('.listContainer').removeClass('hidden');
        $('.subList').empty();
        $('.subList').append(`<h3>${responseJson.ingredient}</h3>`)

        for (i = 0; i < responseJson.substitutes.length; i++) {
            $('.subList').append(`
        <li class="subListItem">${responseJson.substitutes[i]}</li>
    `)
        };

    } else {
        $('.subList').empty();
        $('.mainForm').addClass('formWidth');
        $('.formList').addClass('regulateWidth');
        $('.listContainer').removeClass('hidden');
        $('.subList').append(`<h3 class="notFound formWidth">Sorry, couldn't find any substitutes for that ingredient!</h3>`)
    }
}
/* handles display on 'lets get cookin'' button click */

function displayMealPlan(responseJson) {
    console.log(responseJson);
    let data = responseJson.week;
    let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

    $('.mealWeek').empty();
    $('.contact').addClass('zeroMargin');
    for (i = 0; i < days.length; i++) {
        $('.mealWeek').append(`
        <ul class="mealList">
            <h3 class="days">${days[i]}</h3>
            <li><h4><span class="meal">breakfast:</span><a class="mealLink" href="${data[days[i]].meals[0].link}" target="_blank"> ${data[days[i]].meals[0].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">lunch:</span><a class="mealLink" href="${data[days[i]].meals[1].link}" target="_blank"> ${data[days[i]].meals[1].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">dinner:</span><a class="mealLink" href="${data[days[i]].meals[2].link}" target="_blank"> ${data[days[i]].meals[2].cleanTitle}</a></h4></li>
        </ul>
        <ul class="nutrition">
            <li><span id="calorieCount"> calories:</span> ${data[days[i]].nutrients.calories} <span class="divider">||</span> <span id="proteinCount">protein:</span> ${data[days[i]].nutrients.protein} 
            <span class="divider">||</span> <span id="fatCount">fat:</span> ${data[days[i]].nutrients.fat} <span class="divider">||</span> <span id="carbCount">carbs:</span> ${data[days[i]].nutrients.carbohydrates}</li>
        </ul>
                   `);
    }
}

/* fetches the spoonacular meal planning API */

function getMeals(diet, calories, exclude) {
    function paramEditor() {
        if (diet == '' && calories == '' && exclude == '') {
            return params = {
                apiKey: apiKey
            }
        } else if (diet == '' && calories == '' && exclude !== '') {
            return params = {
                exclude: exclude,
                apiKey: apiKey
            }
        } else if (diet == '' && exclude == '' && calories !== '') {
            return params = {
                calories: calories,
                apiKey: apiKey
            }
        } else if (exclude == '' && calories == '' && diet !== '') {
            return params = {
                diet: diet,
                apiKey: apiKey
            }
        } else if (diet == '' && exclude !== '' && calories !== '') {
            return params = {
                calories: calories,
                exclude: exclude,
                apiKey: apiKey
            }
        } else if (exclude !== '' && diet !== '' && calories == '') {
            return params = {
                diet: diet,
                exclude: exclude,
                apiKey: apiKey
            }
        } else if (calories !== '' && diet !== '' && exclude == '') {
            return params = {
                diet: diet,
                calories: calories,
                apiKey: apiKey
            }
        } else {
            return params = {
                diet: diet,
                calories: calories,
                exclude: exclude,
                apiKey: apiKey
            }
        }
    }
    let paramEdit = paramEditor()
    let newParams = formatQueryParams(paramEdit);
    const mealURL = `${baseURL}mealplanner/generate?${newParams}`

    fetch(mealURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayMealPlan(responseJson))
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        })
}

/* fetches the spoonacular ingredient substitution API */

function getIngredient(ingredient) {
    const params = {
        ingredientName: ingredient,
        apiKey: apiKey
    }
        ;
    let ingredientParams = formatQueryParams(params);
    const ingredientURL = `${baseURL}food/ingredients/substitutes?${ingredientParams}`

    fetch(ingredientURL)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson =>
            displayIngredient(responseJson))
        .catch(err => {
            alert(`Something went wrong: ${err.message}`)
        })

}

/* takes user input for ingredient, passes it to getIngredient function */

function ingredientForm() {
    $('#ingredientButton').click(function () {
        event.preventDefault();
        const ingredient = $('#ingredient').val();
        getIngredient(ingredient);
    })
}

/* automatically scrolls down on button clicks */

function handleScroll() {
    $(".mainButton").click(function (event) {
        $('html, body').animate({ scrollTop: '+=550px' }, 1200);
    });
    $("#ingredientButton").click(function (event) {
        $('html, body').animate({ scrollTop: '+=500px' }, 600)
    })
}

/* handles submission of the main form with user input */

function watchForm() {
    $('.mainButton').click(function (event) {
        event.preventDefault();
        const diet = $('#diet').val();
        const calories = $('#calories').val();
        const exclude = $('#exclude').val();
        getMeals(diet, calories, exclude);


    })
}


$(ingredientForm);
$(watchForm);
$(handleScroll);