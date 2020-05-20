# README

# Project: JavaScript - Calculator #

This is my student solution to The Odin Project's [Calculator project](https://www.theodinproject.com/lessons/calculator).  The goal was to create a standard calculator in the browser that allows for basic addition, subtraction, multiplication, and division operations.  There were a number of small considerations the project requested I keep in mind, such as allowing users to chain operations (e.g. 2 + 3 - 1 = 4).

## Project Post-Mortem ##

I actually anticipated this project would be easier than the [Etch-a-Sketch](https://github.com/jwern/etch-a-sketch) assignment, as the calculator object onscreen was mostly static and only the results screen would need to be updated regularly.  There was not a lot of DOM manipulation required.  However, I soon learned that it wasn't the visible portions of the project that would be the most difficult: that distinction belongs to the wide variety of paths a user could take while completing even "simple" mathematical equations.

To begin with, I simply made the calculator function: it could handle very basic functions like adding or subtracting two numbers.  Every time I input a new equation and didn't get the expected result, I would add another if / else check to deal with that input.  This resulted in a large series of branching `if` statements that became messy very quickly.  This project ended up being just as much about getting the calculator working -- and working in all conditions -- as it was about cleaning up my own code as I went along.

## Challenges ##

The branching `if...else` statements created a huge mess mid-project and a JavaScript file that was simply overwhelming to read.  I spent a number of working sessions simply reducing and extracting the code where I could: any repeated `if` statements were pulled out to a separate function.  I tried to improve readability by adding comments above like functions and explaining what each `if` statement was actually accomplishing.  I think if I had to go back to the code in the future, I could figure it out pretty quickly thanks to my inline documentation.

Handling every outlier case was also a significant challenge.  Simple issues, like preventing a user from inputting multiple decimal points, weren't too difficult.  But dealing with leading zeroes (000.20) or NaN digits (e.g., if a user just typed a decimal without a number) required more consideration.  These special cases resulted in a lot of additional functions and `if` catches that make the code a bit messier, but the result is a calculator that should handle anything you throw at it -- and not produce any typeErrors or other breakages.

## Screenshots ##

![Desktop view screenshot](/images/calculator_screenshot.png)

## To Do ##

I'm actually fairly happy with the calculator's current state.  I accounted for all the "extra credit" options presented by The Odin Project -- such as adding a Backspace button and allowing keyboard input in addition to directly clicking the buttons.  I added my own extra credit features, such as a different background color on hover or keypress and allowing users to chain equations (such as "2 + 2 = = =" resulting in 4, 6, 8), even with single digits ("3 + = = =" results in 6, 9, 12). The calculator works on mobile although it's not a mobile-first design and could use some adjustments to look better on all screen sizes.

I'm using CSS Grid for the layout and the calculator does not look (or work) correct in Internet Explorer.  I prefer at least a working, if not perfect, version in all browsers, but creating an IE-specific version was not a priority at this time.  If I were to revisit, I might try to replace the Grid layout with Bootstrap rows and cols.

I did not account for JavaScript's Base 2 decimal calculations (e.g. 0.1 + 0.2 = 0.30000000000000004).  I would probably use a library to fix this in the future.

And despite all my comments and time spent cleaning up the JavaScript code, I still think it's a bit overwhelming and could be simplified further.  I have a lot of global variables defined upon page load that I'd prefer to move into functions where possible, and some of the larger `if` statements triggered upon specific button presses could probably be extracted to their own smaller functions.

## Technologies ##

This Calculator project was built with HTML, CSS, and JavaScript.  It uses [Bootstrap 4](https://getbootstrap.com/) -- more for styling than layout -- and CSS Grid.  I used [Coolors.co](https://coolors.co/) to create a color palette and [CSSmatic's box-shadow generator](https://www.cssmatic.com/box-shadow) for shading.


