function fetchGitHubInformation(event){

    var username = $("#gh-username").val();  // jQuery to select the value in id gh-username
    if (!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2>`);
    return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
        <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);
}