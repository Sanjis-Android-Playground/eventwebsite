# How to Add Real Bangladesh 2024 Protest Images

## Step 1: Find Real Images

### Recommended Sources:
1. **Google Images Search:**
   - "Bangladesh student protests July 2024"
   - "Bangladesh quota reform protests 2024"
   - "Dhaka University protests 2024"
   - "Sheikh Hasina resignation August 2024"
   - "Muhammad Yunus Bangladesh 2024"
   - "Shahbag protests Bangladesh 2024"

2. **News Websites (Fair Use):**
   - The Daily Star (thedailystar.net)
   - Dhaka Tribune (dhakatribune.com)
   - BBC Bangladesh
   - Al Jazeera Bangladesh coverage
   - Reuters Bangladesh
   - AP News Bangladesh

3. **Social Media:**
   - Twitter/X posts from July-August 2024
   - Facebook posts from Bangladeshi news pages
   - Instagram posts with #BangladeshProtests

## Step 2: Download Images

1. Find images with Creative Commons or Fair Use
2. Right-click → Save Image As
3. Name them appropriately:
   - `student-protest-dhaka-1.jpg`
   - `student-protest-dhaka-2.jpg`
   - `shahbag-protests.jpg`
   - `yunus-swearing-in.jpg`
   - `celebration-august-5.jpg`
   - etc.

## Step 3: Upload to VPS

```bash
# From your local machine where images are downloaded
scp *.jpg ubuntu@144.24.140.245:/tmp/

# On VPS
ssh ubuntu@144.24.140.245
sudo mv /tmp/*.jpg /var/www/bangladesh-events/images/
sudo chmod 644 /var/www/bangladesh-events/images/*.jpg
sudo chown www-data:www-data /var/www/bangladesh-events/images/*.jpg
```

## Step 4: Update Image Paths in HTML

### For Homepage Gallery (index.html)
Replace the image URLs in the gallery section:

```html
<!-- Line ~320 -->
<img src="images/student-protest-dhaka-1.jpg" alt="Bangladesh student protests July 2024">
<img src="images/student-protest-dhaka-2.jpg" alt="Bangladesh protests crowd July 2024">
<img src="images/shahbag-protests.jpg" alt="Shahbag protests Bangladesh 2024">
<img src="images/yunus-swearing-in.jpg" alt="Dr Muhammad Yunus Bangladesh 2024">
<img src="images/celebration-august-5.jpg" alt="Bangladesh celebrating August 2024">
```

### For Event Detail Pages
Update images in:
- `event-student-protests.html`
- `event-government-transition.html`
- `event-interim-government.html`
- `event-reforms.html`

## Step 5: Update JavaScript Gallery Data

In `js/script.js`, update the `galleryData` array (around line 85):

```javascript
const galleryData = [
    {
        image: 'images/student-protest-dhaka-1.jpg',
        title: 'Student Movement Begins',
        description: 'Dhaka University students demand quota reform - July 2024'
    },
    {
        image: 'images/student-protest-dhaka-2.jpg',
        title: 'Massive Turnout',
        description: 'Thousands of students march in Dhaka streets'
    },
    // ... update all 9 items
];
```

## Quick Search Terms for Google Images:

1. **Protests:**
   - "Bangladesh student protests 2024 July"
   - "Dhaka University quota reform protests"
   - "Bangladesh anti-government protests 2024"

2. **Leadership:**
   - "Muhammad Yunus Bangladesh 2024 chief adviser"
   - "Bangladesh interim government swearing in"

3. **Celebrations:**
   - "Bangladesh celebrating August 5 2024"
   - "Shahbag celebration Bangladesh"

## Legal Note:
For educational/news purposes, fair use typically allows:
- Small/thumbnail versions of news images
- Images used for commentary and education
- Properly attributed images

Always check image licenses and give credit when possible.

## After Adding Images:

1. Clear browser cache
2. Reload website
3. Check all gallery images load
4. Verify modal images work
5. Test on mobile devices

## Alternative: Direct Links from News Sites

You can also use direct image URLs from news sites (they're already public):

```html
<!-- Example from news sites -->
<img src="https://www.thedailystar.net/sites/default/files/styles/big_202/public/images/2024/07/XX/protest-photo.jpg">
```

Note: Direct linking may break if news sites remove images.
