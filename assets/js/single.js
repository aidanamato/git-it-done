var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
  // grab repo from url query string
  var queryString = document.location.search;
  var repoName =queryString.split("=")[1];
  
  if (repoName) {
    // display repo name on page
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
  } else {
    // if no repo was given, redirect to the homepage
    document.location.replace("./index.html");
  }
};

var getRepoIssues = function(repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayIssues(data);

        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      // if not successful redirect to homepage
      document.location.replace("./index.html");
    }
  });
};

var displayIssues = function(issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
  
  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title, append to issueEl
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is actually a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to issueEl
    issueEl.appendChild(typeEl);

    // append issueEl to container
    issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function(repo) {
  limitWarningEl.innerHTML = "To see more than 30 issues, click <a href='https://github.com/" + repo + "/issues' target='_blank'>here</a>."
};

getRepoName();