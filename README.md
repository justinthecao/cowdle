# COWDLE

To Whom It May Concern, (this documentation is still in its early stages!)

Welcome to my first HTML/CSS/JS shishkebob. I wanted to get some experience with front-end and ngl it was pretty fun. I took a lot of inspiration from Wordle that 
became extremely popular in 2021 and revamped it to relate to one of my inside jokes with my friends - cows .. cao's. 

I am still in the process of simplifying and cleaning code, but here are some guidelines of how I created it.

First off there is a state variable that stores the current information on the screen, like the word or the letters in the boxes, or what the current rows and columns are.
It is pretty essential for knowing if the game has finished, what part of the game the player is at and so on. There is also a updating state function that updates any
changes that have been made and makes sure the screen is synced up with whatever the user inputted.

Second I need to create the keyboard functionality:
I created a function to detect the keys and update the corresponding boxes letters and later implemented the onscreen keyboard which follows pretty much the same logic.

!! I still have not finished the actual wordle logic, there is still some tricky parts when it comes to those sneaky edge cases.

At first, I used a hardcoded dictionary to choose words and check words against, but to up my project and also learn about some new things I eventually used API's.
  The two api's that I used were WordsApi and DataMuse, wordsapi is the dictionary api that I am checking my words against and datamuse is the one that I am getting the
  words relating to cows from. This part was the trickiest, since I had to get into requests and async functions and all that, but I was pretty happy it worked out in the end.
  

What I really enjoyed was the Toastify popups that I found on a open source repo on github that were really easy to use and integrate to my project. 
  Not only were they easily customizable but they had some functions that allowed me to code a lot less.
  
On the css part, I looked up some tutorials on how to make some animations, but the rest of the classes and fields were mostly all trial and error. 

Overall, it was fun little summer project and I definitely want to keep on continuing this project spree. 



