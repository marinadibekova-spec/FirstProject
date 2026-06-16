---
description: "Use when modifying pages, components, or styles. Open the app in the embedded browser and manually test visual rendering, layout, and component behavior to verify changes work as intended."
applyTo: ["pages/**/*.js", "components/**/*.js", "styles/**/*.css"]
name: "UI Manual Testing & Browser Verification"
---

# UI Changes Must Include Browser Verification

Whenever you modify frontend files (pages, components, or styles), you must manually verify the changes in the embedded browser before completing the task.

## Required Testing Steps

1. **Open the Application**
   - Use `open_browser_page` tool to open `http://localhost:3000` in the integrated browser
   - If the app is already running, navigate to the page

2. **Visual Inspection**
   - Verify that the layout renders correctly
   - Check that colors, spacing, and typography match the intended design
   - Ensure responsive layout works (if applicable)
   - Look for any console errors or warnings in the browser DevTools

3. **Component Interaction Testing**
   - Test any new form fields, buttons, or interactive elements
   - Verify that state changes are reflected in the UI
   - Test form submission and error handling
   - Confirm that navigation and links work

4. **State & Integration**
   - If your changes interact with the API, test the happy path and error cases
   - Verify that list updates (create, edit, delete) reflect in the UI immediately
   - Check that loading states display correctly

## Documentation

- **Take a screenshot** of the changes if visual verification is helpful
- **Report any issues** found during testing—don't mask them
- If tests fail, stop and fix the issue before moving on

## When to Skip

Only skip if:
- Changes are backend-only (API routes, DB schema, build config)
- Changes are to documentation, comments, or README only
- You are explicitly asked not to test

## Example Prompt

> "Update the header styling to use a darker blue and add padding"

**Your response should include:**
1. Code changes ✓
2. Browser screenshot showing the new header ✓
3. Confirmation that the layout didn't break ✓
