var submitQuestionNode = document.getElementById("submitBtn");
var questionTitleNode = document.getElementById("subject");
var questionDescriptionNode = document.getElementById("question");
var allQuestionsListNode = document.getElementById("dataList");
var createQuestionFormNode = document.getElementById("toggleDisplay");
var questionDetailContainerNode = document.getElementById("respondQue");
var resolveQuestionContainerNode = document.getElementById("resolveHolder");
var responseContainerNode = document.getElementById("respondAns");
var commentContainerNode = document.getElementById("commentHolder");
var commentatorNameNode = document.getElementById("pickName");
var commentNode = document.getElementById("pickComment");
var submitCommentNode = document.getElementById("commentBtn");
var questionSearch = document.getElementById("questionSearch");
var resolveBtn = document.getElementById("resolveQuestion");
var newQuestionFormBtn = document.getElementById("newQuestionForm");
var upvoteBtn = document.getElementById("upvote");
var downvoteBtn = document.getElementById("downvote");

// when the new question button is clicked
newQuestionFormBtn.addEventListener("click", showNewQuestionForm);

// showNewQuestionForm function
function showNewQuestionForm() {
    createQuestionFormNode.style.display = "block"
    questionDetailContainerNode.style.display = "none";
    resolveQuestionContainerNode.style.display = "none";
    responseContainerNode.style.display = "none";
    commentContainerNode.style.display = "none";
}

// listen to value change in question search
questionSearch.addEventListener("input", function(event) {
    // show appropriate results
    filterResult(event.target.value);
})

function filterResult(query) {
    var allQuestions = getAllQuestions();

    if(query) {
        clearQuestionPanel();
        
        var filteredQuestions = allQuestions.filter(function(question) {
            if (question.title.includes(query)) {
                return true;
            }
        }) 
        if (filteredQuestions.length) {
            filteredQuestions.forEach(function(question) {
                addQuestionToPanel(question);
            })
        } else {
            printNoMatchFound();
        }
    } else {
        clearQuestionPanel();
        allQuestions.forEach(function(question) {
            addQuestionToPanel(question);
        }) 
    }
}

// clearing the question panel
function clearQuestionPanel() {
    allQuestionsListNode.innerHTML = "";
}

// display all existing questions
function onLoad() {
    // get all questions from storage
    allQuestionsListNode.innerHTML = '';
    var allQuestions = getAllQuestions();

    allQuestions = allQuestions.sort(function(currentQuestion, nextQuestion) {
        if (currentQuestion.isFavorite) {
            return -1;
        }
        return 1;
    })

    allQuestions.forEach(function(question, index) {
        addQuestionToPanel(question);
    });
}

// showing 'no match found'
function printNoMatchFound() {
    var title = document.createElement("h1");
    title.innerHTML = "NO MATCH FOUND!"

    allQuestionsListNode.appendChild(title);
}

onLoad();

submitQuestionNode.addEventListener("click", onQuestionSubmit)

// on clicking the submit question button
function onQuestionSubmit() {
    var question = {
        title: questionTitleNode.value,
        description: questionDescriptionNode.value,
        responses: [],
        upvotes: 0,
        downvotes: 0,
        createdAt: Date.now(),
        isFavorite: false
    }
    saveQuestion(question);
    addQuestionToPanel(question);
}

// save question to storage
function saveQuestion(question) {
    var allQuestions = getAllQuestions();
    allQuestions.push(question);
    localStorage.setItem("questions", JSON.stringify(allQuestions));
    
}

// append question to the left panel
function addQuestionToPanel(question, index) {
    var questionContainer = document.createElement("div");
    questionContainer.style.background = "#008080";

    var newQuestionTitleNode = document.createElement("h4");
    newQuestionTitleNode.innerHTML = question.title;
    questionContainer.appendChild(newQuestionTitleNode);

    var newQuestionDescriptionNode = document.createElement("p");
    newQuestionDescriptionNode.innerHTML = question.description;
    questionContainer.appendChild(newQuestionDescriptionNode);

    var upvotesNode = document.createElement("span");
    upvotesNode.innerHTML = "Upvotes: " + question.upvotes + "  ";
    questionContainer.appendChild(upvotesNode);

    var downvotesNode = document.createElement("span");
    downvotesNode.innerHTML = "Downvotes: " + question.downvotes;
    questionContainer.appendChild(downvotesNode);

    var dateTimeNode = document.createElement("h3");
    dateTimeNode.innerHTML = new Date(question.createdAt).toLocaleString();
    questionContainer.appendChild(dateTimeNode);

    var createdAtNode = document.createElement("p");
    createdAtNode.innerHTML = "Created: " + UpDateAndConvertTime(createdAtNode)(question.createdAt) + " ago";
    questionContainer.appendChild(createdAtNode);

    var addToFavBtn = document.createElement("button");
    
    if (question.isFavorite) {
        addToFavBtn.innerHTML = "Remove fav";
        addToFavBtn.style = "background-color: red";
    } else {
        addToFavBtn.innerHTML = "Add fav";
        addToFavBtn.style = "background-color: yellow";
    }
    questionContainer.appendChild(addToFavBtn);

    addToFavBtn.addEventListener("click", toggleFavQuestion(question));

    allQuestionsListNode.appendChild(questionContainer);

    questionContainer.addEventListener("click", onQuestionClick(question, index));

    clearQuestionForm();
}

// 
function toggleFavQuestion(question) {
    return function(event) {
        question.isFavorite = !question.isFavorite;
        updateQuestion(question);
        if (question.isFavorite) {
            event.target.innerHTML = "Remove Fav";
            event.target.style = "background-color: red";
        } else {
            event.target.innerHTML = "Add fav";
            event.target.style = "background-color: yellow";
        }
        onLoad();
    }
}

// set interval and update time
function UpDateAndConvertTime(element) {
    return function(time) {
        setInterval(function() {
            element.innerHTML = "Created: " + convertDateToCreatedAtTime(time) + " ago";
        }, 1000);
    }
}

// convert date to how many hours, minutes and seconds ago
function convertDateToCreatedAtTime(date, element) {

    var currentTime = Date.now();
    var timeElapsed = currentTime - new Date(date).getTime();

    var secondsDiff = Math.round(timeElapsed / 1000);
    var minutesDiff = Math.round(secondsDiff / 60);
    var hoursDiff = Math.round(minutesDiff / 60);
    
    if (hoursDiff === 0) {
        return minutesDiff%60  + " minutes " + secondsDiff%60 + " seconds ago";
    } else if (minutesDiff === 0) {
        return hoursDiff + " hours " +  secondsDiff + " seconds ago";
    } else {
        return hoursDiff + " hours " + minutesDiff%60  + " minutes " + secondsDiff%60 + " seconds ago";
    }
}

// clearing the question form after submitting
function clearQuestionForm() {
    questionTitleNode.value = '';
    questionDescriptionNode.value = '';
}

// get all questions from local storage
function getAllQuestions() {
    var allQuestions = localStorage.getItem("questions");
    if (allQuestions) {
        allQuestions = JSON.parse(allQuestions);
    } else {
        allQuestions = [];
    }
    
    return allQuestions;
}

// listen for click on question and display in right pane
function onQuestionClick(question, index) {
    return function() {
        // closer you can access question variable
        // hide question panel
        hideQuestionPanel();

        // clear last details
        clearQuestionDetails();
        clearResponsePanel();

        // show clicked question
        showDetails();

        // create question details 
        addQuestionToRight(question);

        // show all previous responses
        question.responses.forEach(function(response) {
            addResponseToPanel(response);
        })

        // listen for response submit
        submitCommentNode.addEventListener("click", onResponseSubmit(question));

        // when the resolve button is clicked
        // resolveBtn.addEventListener("click", onResolveClick(question, index), {once: true});
        resolveBtn.onclick = onResolveClick(question, index);

        // when the upvote button is clicked
        // upvoteBtn.addEventListener("click", onUpvoteClick(question));
        upvoteBtn.onclick = onUpvoteClick(question);

        // when the downvote button is clicked
        // downvoteBtn.addEventListener("click", onDownvoteClick(question));
        downvoteBtn.onclick = onDownvoteClick(question);
    }
}

// update question function
function updateQuestion(updatedQuestion) {
    var allQuestions = getAllQuestions();

    var revisedQuestions = allQuestions.map(function(question)
    {
        if( updatedQuestion.title  === question.title)
        {
        return updatedQuestion;
        }

        return question;
    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

// when upvote button is clicked
function onUpvoteClick(question) {
    // console.log(allQuestions[0]);
    // allQuestions[index].upvotes += 1;
    // localStorage.setItem("questions", JSON.stringify(allQuestions));
    // onLoad();
    return function() {
        question.upvotes++;
        updateQuestion(question);
        onLoad();
    }
}

// when downvote button is clicked
function onDownvoteClick(question) {
    return function() {
        question.downvotes++;
        updateQuestion(question);
        onLoad();
    }
}

// when the resolve button is clicked
function onResolveClick(question, index) {
    return function() {
        // console.log(question);
        var allQuestions = getAllQuestions();
        allQuestions.splice(index, 1);
        localStorage.setItem("questions", JSON.stringify(allQuestions));
        onLoad();
        showNewQuestionForm();
    }
}

// listen for click on submit response button
function onResponseSubmit(question) {
    return function() {
        // console.log("hello");
        var response = {
            name: commentatorNameNode.value,
            description: commentNode.value
        };

        saveResponse(question, response);
        addResponseToPanel(response);
        clearResponseInput();
    }
}

// display response in response section
function addResponseToPanel(response) {
    var userNameNode = document.createElement("h3");
    userNameNode.innerHTML = response.name;

    var userCommentNode = document.createElement("p");
    userCommentNode.innerHTML = response.description;

    var container = document.createElement("div");
    container.appendChild(userNameNode);
    container.appendChild(userCommentNode);

    responseContainerNode.appendChild(container);
}

// hide question panel
function hideQuestionPanel() {
    createQuestionFormNode.style.display = "none";
}

// display question details
function showDetails() {
    questionDetailContainerNode.style.display = "block";
    resolveQuestionContainerNode.style.display = "block";
    responseContainerNode.style.display = "block";
    commentContainerNode.style.display = "block";
}

// show question
function addQuestionToRight(question) {
    var titleNode = document.createElement("h3");
    titleNode.innerHTML = question.title;

    var descriptionNode = document.createElement("p");
    descriptionNode.innerHTML = question.description;

    questionDetailContainerNode.appendChild(titleNode);
    questionDetailContainerNode.appendChild(descriptionNode);
}

// 
function saveResponse(updatedQuestion, response) {
    var allQuestions = getAllQuestions();

    var revisedQuestions = allQuestions.map(function(question) {
        if (updatedQuestion.title === question.title) {
            question.responses.push(response)
        }
        return question;
    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestions));
}

//
function clearQuestionDetails() {
    questionDetailContainerNode.innerHTML = "";
}

// 
function clearResponsePanel() {
    responseContainerNode.innerHTML = "";
}

//
function clearResponseInput() {
    commentatorNameNode.value = "";
    commentNode.value = "";
}