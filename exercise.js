const apiKey = 'e665e607a65e442b806a7f9495411f15'
const baseURL = 'https://api.spoonacular.com/'

/* PARAMATER FORMATTING FUNCTION */ 

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  /* INGREDIENT DISPLAY */ 

function displayIngredient(responseJson){
    console.log(responseJson);
    $('#ingredientButton').hide();
    $('#ingredient').hide();
    $('.ingredientForm').append(`
    <input class="backToSearch" type="button" value="search again">`);
    $('.backToSearch').click(function(){
        $('.backToSearch').hide();
        $('#ingredientButton').show();
        $('#ingredient').show();
        $('.subList').hide();
        $('.mainForm').removeClass('formWidth');
    })
    if (responseJson.status !== "failure"){
    $('.mainForm').addClass('formWidth');
    $('.subList').append(`<h3>${responseJson.ingredient}</h3>`);
    for (i=0; i < responseJson.substitutes.length; i++){
    $('.subList').append(`
        <li class="subListItem">${responseJson.substitutes[i]}</li>
    `)
    } 

    }else {
        $('.subList').append(`<h3 class="notFound">Sorry, couldn't find any substitutes for that ingredient!</h3>`)
    }
}
/* MEAL PLAN DISPLAY */ 

function displayMealPlan(responseJson) {
    console.log(responseJson.week);
    let data = responseJson.week;
    let days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

    $('.mealWeek').empty();
    for (i=0; i < days.length ;i++){
        $('.mealWeek').append(`
        <ul class="mealList">
            <h3 class="days">${days[i]}</h3>
            <li><h4><span class="meal">breakfast:</span><a class="mealLink" href="${data[days[i]].meals[0].link}" target="_blank"> ${data[days[i]].meals[0].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">lunch:</span><a class="mealLink" href="${data[days[i]].meals[1].link}" target="_blank"> ${data[days[i]].meals[1].cleanTitle}</a></h4></li>
            <li><h4><span class="meal">dinner:</span><a class="mealLink" href="${data[days[i]].meals[2].link}" target="_blank"> ${data[days[i]].meals[2].cleanTitle}</a></h4></li>
        </ul>
            `);
        }}

/* MEAL & TRIVIA FETCH */ 


function getMeals(diet,calories,exclude){
    function paramEditor(){
    if (diet=='' && calories=='' && exclude==''){
        return params = {
        apiKey: apiKey
        }
    } else if (diet=='' && calories=='' && exclude!==''){
        return params = {
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (diet=='' && exclude=='' && calories!==''){
        return params = {
        calories: calories,
        apiKey: apiKey
        }
    } else if (exclude=='' && calories=='' && diet!==''){
        return params = {
        diet: diet,
        apiKey: apiKey
        }
    }else if (diet=='' && exclude !== '' && calories !== ''){
        return params = {
        calories: calories,
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (exclude!=='' && diet !=='' && calories == ''){
        return params = {
        diet: diet,
        exclude: exclude,
        apiKey: apiKey
        }
    } else if (calories !=='' && diet!=='' && exclude==''){
        return params = {
        diet: diet,
        calories: calories,
        apiKey:apiKey
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

    /* ingredient API */

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

/* ON SUBMITTING FORM FUNCTION */

function ingredientForm(){
    $('#ingredientButton').click(function(){
        event.preventDefault();
        const ingredient = $('#ingredient').val();
        getIngredient(ingredient);
    })
}

function watchForm() {
    $('.mainButton').click(function(event){
        event.preventDefault();
        const diet = $('#diet').val();
        const calories = $('#calories').val();
        const exclude = $('#exclude').val();
       getMeals(diet,calories,exclude);
       

    })
}


$(ingredientForm);
$(watchForm);