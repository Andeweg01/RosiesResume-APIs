function userInformationHTML(user){
    return `
        <h2>${user.name}
            <span class="small-name">
              ($<a href="${user.html_url}" target="_blank">${user.login}</a>)
            </span>
        </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url} target="_blank">
                  <img src="${user.avatar_url}" width="80" heigth="80" alt="${user.login}" />
                </a>
            </div>
            <p>Followers: ${user.followers} - Following: ${user.following} <br>
            Repos: ${user.public_repos}</p>
        </div>`;
}

function fetchGitHubInformation(event){

    var username = $("#gh-username").val();  // jQuery to select the value in id gh-username
    if (!username) { // if not username
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`); // we write html into id gh-user-data div
    return; // the return prevents looking into the GitHub API; we leave the if
    }

    $("#gh-user-data").html( // if data is entered the loader will show
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

        $.when( // when, then: promise... when this is done it promises something
            $.getJSON(`https://api.github.com/users/${username}`) // when we've got a response from the GitHub API
            // JSON function with url
        ).then( // then run a function to display it in the gh-user-data div
            function(response){ // the response from the JSON method will be stored
                var userData = response; // into the variable userData
                $("#gh-user-data").html(userInformationHTML(userData));
                // jQuery selector to select the gh-user-data div and set HTML to the result of another function userInformationHTML
                // and userData is the argument
            }, function(errorResponse){ // if there is a not found error the html 'no info found..' will be shown in gh-user-data div
                if (errorResponse.status == 404){ // not found error
                    $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`);
                } else { // if it's not a 404 error
                    console.log(errorResponse); // the full error message will display
                    $("#gh-user-data").html( // into the div we get the JSON response from the errorResponse
                        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }
            });
}
