---
author: kellis
date: 2025-08-21 00:00:00 Z
title: Making Visual Comparison Test Maintenance Easier with GitHub Actions
summary: Automating Playwright visual test maintenance with GitHub Actions simplifies updating baseline screenshots across platforms. By running tests on both Windows and Linux via a workflow, developers avoid manual setup and ensure consistent UI validation, even when third-party libraries like CO2.js change underlying data.
categories:
- Testing
- Open Source
- Tech
tags:
- playwright
- github actions
- visual comparison
- screenshot testing
- testing

--- 

# **Making Visual Comparison Test Maintenance Easier with GitHub Actions**

## **Let's Set the Scene...**

Your application is a UI report-generating tool with lots of nice graphical elements, and you’ve decided that using screenshot comparisons is a handy way to ensure these elements remain accurate as updates are made to the application.

Playwright’s Visual Comparison feature is perfect for this. After manually validating that all elements are accurate, Playwright generates baseline screenshots. Subsequent test runs take screenshots and compare them directly with these baseline images. Including these checks in a regression suite can help catch issues where something has gone awry with the UI elements themselves or with the underlying calculations and data they reflect.

---

## **Real-World Example: Tech Carbon Standard Estimator**

Let’s take a real-world example. Scott Logic has developed an excellent open-source application that allows users to see the estimated CO₂ output from their technology — the [Tech Carbon Standard Estimator](https://www.techcarbonstandard.org/estimator). Data is represented in both a tree graph and a table, making it a great candidate for Visual Comparison testing. But there’s a catch...

The estimated CO₂ values presented in the application are generated using a third-party JavaScript library — [CO2.js](https://www.thegreenwebfoundation.org/co2-js/). Occasionally, the underlying calculations in this library are updated to provide more accurate estimates. A user inputting the same technology usage data into the application may then see a slight change in the estimated CO₂ — the graph will be slightly different, and the table will contain new values.



Herein lies our problem — the CO2.js library quietly gets updated, the regression tests run, and the visual comparison tests all fail. This can lead to confusion and requires manual intervention. To resolve this (once you’ve validated that the UI changes are acceptable), you’ll need to generate new baseline screenshots by running the tests with the `--update-snapshots` flag and then commit them to the codebase via a new PR.

---

## **Platform-Specific Baselines**

That solution seems relatively straightforward, but there’s a small nuance to Playwright’s Visual Comparison feature that requires more careful consideration.

Playwright’s baseline screenshots are OS and browser-specific. For example, if the screenshots are generated using Chrome within a Windows environment, they are named accordingly:

```
myscreenshot-chromium-win32.png
```

Subsequent runs of the tests in the Chrome/Windows configuration will specifically look for baseline comparison images with the `chromium-win32` filename.

Whereas, if the images are generated in a Linux environment, they are named:

```
myscreenshot-chromium-linux.png
```

Since the application is open source, we want to ensure it’s as platform-agnostic as possible, allowing developers and testers to work in their preferred environments. We also need to consider the platforms used in CI/CD pipelines. Taking all this into account, it makes sense to provide baseline screenshots for both Windows and Linux platforms, allowing tests to run successfully in either environment.

---

## **The Problem, Multiplied**

When new baseline screenshots are required, the tests must be run on both platforms separately, and the new files committed to the codebase. This would require either one individual with the project set up in both Windows and Linux, or multiple individuals working in different environments — neither of which is ideal.

---

## **Automating with GitHub Actions**

Wouldn’t it be great if we could generate new baseline screenshots for both Windows and Linux platforms with the click of a button? With the help of GitHub Actions and workflows, we can do just that.

Let’s start by creating a composite action that runs the Playwright tests with the `--update-snapshots` flag:

~~~~ yaml
name: 'Update Playwright Screenshots'
description: 'Installs dependencies and runs Playwright tests with the --update-snapshots parameter'
runs:
  using: 'composite'
  steps:
    - name: Install Playwright Dependencies
      run: npm run playwright-install
      shell: bash
    - name: Run Playwright tests
      run: npm run playwright-test -- --update-snapshots
      shell: bash
~~~~


We then incorporate this action into a workflow alongside some pre-existing actions. See the whole workflow file [here](https://github.com/ScottLogic/sl-tech-carbon-estimator/blob/develop/.github/workflows/update-playwright-screenshots.yml).

### **Workflow Breakdown**

~~~~ yaml
on:
  workflow_dispatch:
    inputs:
      commit_message:
        description: 'Commit message'
        required: false
        default: 'Auto-commit: Update screenshots'

permissions:
  contents: write
~~~~

This workflow runs on `workflow_dispatch`, which means it only runs when manually triggered by a user. The inputs allow for a custom commit message to be passed to the workflow, with a default set. Permissions are configured to allow the workflow to write to GitHub — in this case, it will commit changes to the branch it was run against.

~~~~ yaml
jobs:
  playwright_screenshots:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]

    steps:
      - uses: actions/checkout@v4

      - name: Set up environment
        uses: ./.github/actions/set-up-environment

      - name: Run Playwright
        uses: ./.github/actions/update-playwright-screenshots

      - name: Check for changes
        id: changes
        shell: bash
        run: |
          if [ -n "$(git status --porcelain)" ]; then
            echo "changed=true" >> $GITHUB_OUTPUT
          else
            echo "changed=false" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push changes
        if: steps.changes.outputs.changed == 'true'
        shell: bash
        run: |
          git config --local user.email "${{ github.actor }}@users.noreply.github.com"
          git config --local user.name "${{ github.actor }}"
          git add .
          git commit -m "${{ github.event.inputs.commit_message || 'Auto-commit: Update screenshots' }} (by @${{ github.actor }})"
          git push
~~~~

We use a matrix strategy to run tests on both Windows and Linux environments simultaneously. The steps are as follows:

1. Checkout the code  
2. Set up the Node environment  
3. Run the Playwright action we created earlier (to update screenshots)  
4. Check if there have been any file changes  
5. Commit and push these changes as the GitHub user who is currently logged in or authorized  

Once the workflow has been added to the default branch of the codebase (e.g., `develop`, `main`), you can run it against your branch either through the GitHub UI Actions tab or using GitHub CLI. The Playwright tests will generate new baseline screenshots, and your regression suite should be back in the green.

If you’d like to see an example run of this workflow with new files being committed, you can find that [here](https://github.com/ScottLogic/sl-tech-carbon-estimator/actions/runs/17045665875). You’ll notice there are two jobs — one for each OS.

---

## **Final Thoughts**

Visual Comparison can be a powerful part of the testing toolkit when dealing with applications that have a complex graphical interface. But maintaining these tests can be frustrating when valid UI changes occur regularly.

Building an automated way to update baseline screenshots — regardless of platform — makes maintenance easy and lets you get your tests back in shape with minimal fuss, giving you the chance to focus on all those other testing priorities!

---

If you're interested in learning more about the Tech Carbon Standard Estimator, check out the project [here](https://github.com/ScottLogic/sl-tech-carbon-estimator)