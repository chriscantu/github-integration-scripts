# Requirements
* NodeJS installed
* Github Account
* Github API Token
* Existing Repo on Github

## createBranch.js 
* Will create a branch based off of the latest commit on master

### How to use:
`node createBranch.js name_of_branch_to_be_created`

## createTag.js
* Will create a tag of the latest commit in master
* Tag name will be the date if not specified

### How to use:
<<<<<<< HEAD
`node createTag.js (optional_tag_name)`

## mergePullRequest.js
* Will merge a pull request based off a branch name

### How to use: 
`node mergePullRequest.js name_of_branch_to_be_merged`
