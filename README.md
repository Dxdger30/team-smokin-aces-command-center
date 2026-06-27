# Team Smokin Aces Command Center

## Overview

The Team Smokin Aces Command Center is a Google Apps Script application used to automate management of the Team Smokin Aces disc golf club.

The long-term goal is a one-click weekly update that automatically discovers tournaments, imports results, updates player statistics, refreshes leaderboards, and updates the dashboard.

---

# Current Environment

Development Environment

* Google Apps Script
* Google Sheets
* VS Code
* Git
* GitHub
* clasp

Repository

* GitHub is the source control.
* Google Apps Script is the deployment target.
* VS Code is the primary editor.

---

# Current Features

Existing

* Player roster
* Tournament importer
* Results importer
* Dashboard
* Leaderboards
* Statistics
* Weekly Scanner (under development)

---

# Version 1.0 Roadmap

Sprint 1

Automatic Tournament Discovery

Goal

Read every player in the Players sheet.

Visit each PDGA player page.

Discover every tournament played during the configured season.

Ignore tournaments already imported.

Automatically add new tournaments into the Tournaments sheet.

---

Sprint 2

Automatic Results Import

Import every discovered tournament.

Populate the Results sheet.

---

Sprint 3

Statistics

Refresh player statistics.

---

Sprint 4

Leaderboards

Refresh every leaderboard.

---

Sprint 5

Dashboard

Refresh dashboard charts and summaries.

---

# Development Rules

Always work one feature at a time.

Always provide complete file replacements.

Never rewrite working code without reason.

Every coding session should end with a working feature.

Always provide exact VS Code instructions.

Always provide exact Git commands.

Always provide exact clasp commands.

---

# Current Workflow

1. Edit files in VS Code.
2. Save.
3. Run:

clasp push

4. Test in Google Sheets.

5. Commit:

git add .

git commit -m "Describe feature"

git push

---

# Current Goal

Finish Sprint 1:

Automatic Tournament Discovery.
