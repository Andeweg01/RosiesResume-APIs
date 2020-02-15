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

function repoInformationHTML(repos){
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }

    var listItemsHTML = repos.map(function(repo){
        return `<li>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </li>`;
    });

    return `<div class="clearfix repo-list">
    <p>
    <strong>Repo List:</strong>
    </p>
    <ul>
        ${listItemsHTML.join("\n")}
        </ul>
        </div>`;
}

function fetchGitHubInformation(event){
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();  // jQuery to select the value in id gh-username
    if (!username) { // if not username
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`); 
        // we write html into id gh-user-data div
    return; // the return prevents looking into the GitHub API; we leave the if
    }

    $("#gh-user-data").html( // if data is entered the loader will show
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

        $.when( // when, then: promise... when this is done it promises something
            $.getJSON(`https://api.github.com/users/${username}`), 
            // when we've got a response from the GitHub API
            // JSON function with url
            $.getJSON(`https://api.github.com/users/${username}/repos`) 
            // listing the repos for this user
        ).then( // then run a function to display it in the gh-user-data div
            function(firstResponse, secondResponse){ // the responses from the JSON methods will be stored
                var userData = firstResponse[0]; // into the variable userData. 
                // Having two calls the when() method packs it into arrays and they're the first element (index)
                var repoData = secondResponse[0]; // into the variable repoData.
                $("#gh-user-data").html(userInformationHTML(userData));
                // jQuery selector to select the gh-user-data div and set HTML to the result of another function userInformationHTML
                // and userData is the argument
                $("#gh-repo-data").html(repoInformationHTML(repoData));
            }, function(errorResponse){ // if there is a not found error the html 'no info found..' will be shown in gh-user-data div
                if (errorResponse.status == 404){ // not found error
                    $("#gh-user-data").html(
                        `<h2>No info found for user ${username}</h2>`);
                } else if (errorResponse.status == 403){ // too many calls made (forbidden)
                    var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);
                    $("#gh-user-data").html(
                        `<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
                    } else {
                        console.log(errorResponse);
                        $("#gh-user-data").html( 
                            // into the div we get the JSON response from the errorResponse
                        `<h2>Error: ${errorResponse.responseJSON.message}</h2>`);
                }
            });
}

$(document).ready(fetchGitHubInformation);