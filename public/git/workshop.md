
# Outline for Advanced Git Workshop

1. Go through initial slides, point to slide URL

2. Git is Distributed
    a. Show first few slides with diagrams
    b. **Fork** ES6 todos project (jakerella/es6-todos) _SPEAKER_: into jk-workspace
    c. Set up remotes for updating from source
    d. _SPEAKER_: create new branch in repo on GH
    e. Check for updates from source (fetch & merge)
    f. Show branch tracking (or not), create a branch locally and on server

3. Showing diffs
    a. make a change, run `git diff`
    b. change another file (in src), run `git diff` to see multiple files changes
    c. run `git diff src/` to see only that change
    d. show diffing branches `git diff master step-1`
    e. explain hunk output, show navigation and regex usage in editor (and how to `q`uit)
    f. show only "since branching" diff: `git diff master...step-1`
    g. talk about branches as just the latest commit on that line, show diff using commit hash

4. Slides for data integrity
    a. explain commit hashes, discuss that it includes EVERYTHING from the commit

5. Amending commits
    a. Make commit with misspelled message, then amend it
        i. **Show changed commit hash** and discuss why this could be a problem
    b. Briefly show reflog (more later)
    c. Change two files, only commit one, show adding file and amending
    d. Talk about how amend is ONLY for previous commit

6. Interactive rebase
    a. Make another change and commit it, oops... now we need to amend an older commit!
    b. `git rebase --interactive HEAD^^^`
    c.

7. Undoing Changes
    a.

8. Git Stash
    a.

9. Logs
    a.

10. Merging
    a.

11. Rebasing
    a.

12. Cherry picking
    a.


**Extra Time?**

13. Blame
    a.

14. Bisect
    a.
