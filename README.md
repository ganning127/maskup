MaskUp 😷 
==================
Created by Ganning Xu and Elise Tong.
## What this project does 🌎
[MaskUp](https://easybag98.qoom.space/~/MaskUp) is a web app that features both live and group mask detection, along with statistics describing daily detection rate. Here are some of MaskUp's features: 

**Live Mask Detection**

![](https://i.imgur.com/8oCAecc.png)

MaskUp features live mask detection powered by Google's Teachable Machine. This ML model was trained with 938 images from [Kaggle](https://www.kaggle.com/).

**Live Detection Statistics**

![](https://i.imgur.com/VCd6aGS.png)

Live detection statistics allows users to see a visualization of mask / no mask trends over time. Hovering over a data point shows you the exact value for that point.

**Live Covid-19 Cases**

![](https://i.imgur.com/w5wSNj4.jpg)

Using the Covid-19 API, the homepage of MaskUp automatically fetches the lastest number of cases and deaths, keeping people both informed and healthy!


**Vaccine Locator**

![](https://i.imgur.com/lSvusYP.jpg)

MaskUp's vaccine locator allows individuals to find a vaccine near them, allowing everyone to stay safe!

**Group Mask Detection**

![](https://i.imgur.com/ws68MzC.jpg)

Upload multiple pictures (with as many people in each), and you will be provided with a summary of each of their mask status. Users are also able to export group mask detection stats to a `.csv` file, for further analysis. 


**Handwashing reminders**

![](https://i.imgur.com/0uC4z0J.jpg)

Constantly forgetting to wash your hands? [Sign up](https://easybag98.qoom.space/~/MaskUp/notified) for texts to wash your hands every two hours!

**Symptom Tracker**

![](https://i.imgur.com/ae5bpF0.jpg)

Simply fill out a form, checking for which symptoms you are feeling, and MaskUp will tell you the percentage of being dangerous to others!

**Symptom Results**

![](https://i.imgur.com/vpLdB5A.jpg)

Check the results page to see a visualization of your past symptom responses, and which symptoms are affecting you the most. Users ca also export this to a `.csv` file for further analysis. 

## Why this project is useful 📈
187 million: the number of Covid-19 cases thus far. With Covid cases spiking because of the delta variant, masks are still essential for helping all of us stay safe, regardless of vaccination status. 

As a result, MaskUp was created. With live and group mask detection, MaskUp could be used in public spaces worldwide in order to only allow entry to those who are wearing a face mask. 

Whenever MaskUp detects that a user has a mask on, a webhook is sent to a custom URL, which could be used to open a door or gate. 

This not only keeps us safe, but also helps flatten the novel coronavirus curve.

- Symptom reports are able to be exported and sent to medical providers.
- Covid data visualizations help data scientists see the progress of Covid-19.

## How we built this 🔨
- NodeJS
- NPM Packages (Jimp, Twilio)
- Google Teachable Machine
- Qoom database
- [Covid-19 API](https://covid19api.com/)
- Web Dev (HTML, CSS, Vanilla JS, Bootstrap)

## Accomplishments that we are proud of ⭐
MaskUp was our first time working together with a teammate to create a web application. This helped us both learn how to allow each person to complete the part of the project that they were stronger in. For example, Ganning is a better backend developer, so he focused on the NodeJS and Vanilla JS part of the project, while Elise helped design and prototype MaskUp on Figma. 

## What is next for this project 📱 
In the future, MaskUp could be turned into a mobile app. A MaskUp app not only makes mask detection more convenient, but also eliminates techincal differences between computers. For example, some computers don't have a webcam, preventing users from utilizing MaskUp's live detection feature. 
