
# Outline for Advanced Git Workshop

1. Welcome
    a. point to slide URL **WARNING** that this is NOT an introduction to Git
    b. we'll be in CLI the whole time
    c. get people to download git prompt script: http://bit.ly/git-cli-prompt

2. Git is Distributed
    a. Show first few slides with diagrams
    b. **Fork** ES6 todos project (jakerella/es6-todos) (**JORDAN** into "jk-workspace")
    c. Show branch commands (`-a`, `-vv`)
        i. Discuss "tracking", show how to set tracking on new branch
    d. Discuss OSS workflow
        i. Set up remotes for updating from source
        ii. **SPEAKER**: create new branch in GH in ORIGINAL repo and make commit
        iii. Check for updates from source (fetch & merge)

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
        i. Discuss what "HEAD" means... and what branch names are
    c. "edit" one or two commits ("pick" others)
    d. show "stopped" message, show status and log
    e. make change, commit, continue: `git rebase --continue`
    f. show reflog
    g. do it again, show aborting: `git rebase --abort`

7. Undoing Changes
    a. unstaged changes: `checkout` file or dir (warning about new files not being removed!)
    b. staged changes: `reset` (mention more on that later)
    c. talk about three phases (show diagram)
    d. committed changes (using `reset`)
        i. Examples: soft, mixed, hard
    e. Show reflog, reset to reflog entry (`HEAD@{1}`)

8. Git Stash
    a. Discuss reasoning
    b. make change, show basic stash, show `stash list`
    c. show `git stash save "..."`
    d. show apply & drop
    e. show pop (discuss good stash management & mention LOCAL only)

9. Logs
    a. basic log view (CLI); `--oneline` for quick viewing
        i. explain using up/down and "q" to navigate and quit
        ii. discuss 7 char hashes and uniqueness
    b. checkout `step-1` branch and show `--graph`, discuss merges briefly
        i. for a better example, switch to mockjax and show graph (encourage them to explore)
    c. filtered searching (switch to mockjax?)
        i. `--no-merges`
        ii. `--author` (`git log --no-merges --author="Dima"`), discuss case sensitivity and full field
        iii. `--` (for directories) (`git log --no-merges -- lib/`)
        iv. `--grep` (for messages) (`git log --grep=bump`), discuss regex specificity: `git log --grep=[Bb]ump`
        v. `-S` (search file contents) (`git log -- package.json -S version`)

10. Merging
    a. Discuss what it is, show diagram
        i. make branch, make change and commit, merge into another (`master`?)
        ii. show log
    b. Discuss what a "fast-forward" is, and how to prevent them (and why)
        i. do another merge with `--no-ff`
        ii. show log
    c. Discuss divergent changes, show diagram
        i. create another branch, make commits on both (diff files)
        ii. merge from one into `master`, then the other into `master`
        iii. show merge commit in log, discuss how it has two parents
        iv. mention how old branch doesn't go away, but also discuss goo branch hygiene
    d. Discuss conflicts (why & when)
        i. make a change, try to merge that into other branch (see conflict message)
        ii. resolve conflict, `add` file, and `commit`
        iii. show resulting log

11. Rebasing
    a. Discuss what it is, show diagram
        i. **WARNING!** (changes history, everyone needs to be on board)
        ii. make branch, make change and commit, rebase onto ____?
        iii. show log & reflog
    b. mention that you can still get conflicts!!
        i. process is the same, except you `git rebase --continue` after committing resolution
    c. show aborting
    d. discuss `git pull` - what does it do? (fetch & merge)
        i. show `git pull --rebase`
        ii. show setting up config:
            `git config branch.master.rebase true`
            `git config branch.autosetuprebase always`

12. Cherry picking
    a. Discuss what it is, show diagram
    b. make change on one branch, cherry pick to another
        i. show log & reflog and point out commit hash change
    c. **WARNING!** This changes history, only do this when old branch is DEAD

13. Blame
    a. Discuss reasoning (find who made particular change, not accusatory)
    b. `git blame [path to file]` (could by mockjax?)
    c. discuss output and navigation
    d. this is the whole file... could be a problem
    e. show line restriction: `git blame -L20,30 [path to file]` (NOTE: lines come before `blame`)
    f. Other useful options: `--date short`, `-s` (no author/date)

14. Bisect
    a. What if we don't know where the problem is, or when it started?
        i. We can walk through the commits to find problem commit!
    b. Start it up:
        i. switch to broken branch (may be master)
        ii. `git bisect start`, then `git status` to see that we are in a bisect!
        iii. indicate that the current HEAD of branch is bad: `git bisect bad`
        iv. indicate the last known "good" commit: `git bisect good [hash]` (or use HEAD~20)
        v. **NOTE**: we are now in detached HEAD state (see it in `status`)
        vi. ALSO: we are NOT at the commit specified... we are "bisecting" the commit history
    c. Find the bad commit:
        i. Is the current commit we're on good or bad? `git bisect good` (or `bad`)
        ii. If "good", bisect jumps us ahead, otherwise jumps us back (not 1 commit, many)
        iii. Is the current commit good or bad? `git bisect good` (or `bad`)
        iv. If "bad", notice we jump in between the first commit we were on and the last one
        v. Keep going until you find the first bad commit
        vi. Eventually git tells you: "0b8caf8... is the first bad commit"
    d. Now you can `blame` or inspect or test, etc.
        i. **DON'T FORGET**: you are still in detached HEAD state
        ii. When done testing, etc run `git bisect reset`
        iii. NOTE: you can ALWAYS run `reset` to get out
