---
title: "Data From Virtualized List"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

Modern web design may choose to use virtual list or virtual table when displaying large amount of structured data.
The central idea is to increase page rendering performance by avoid creating each node for each data item.
Virtualized list keeps a few DOM nodes (most commonly `<li>`) only enough to fill its viewport, and change
the content of those DOM nodes by inspecting location of slide of the scrollbar when `scroll` event is fired.

In order to make the scrollbar display correct ratio despite the fact that there is only a few `<li>` nodes,
virtualized list usually takes the following DOM structure:

```html
    <div style="height: 200px; overflow: scroll;">
        <!-- a javascript computed height, to make the scrollbar ratio render correctly -->
        <div style="height: 20000;">
            <!-- but there are actually a few li enough to fill the 200px viewport -->
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </div>
    </div>
```

[react-virtualized](https://www.npmjs.com/package/react-virtualized).

The use of virtual list introduce difficulties for frameworks like playwright or puppeteer.

## solution 1

```ts
            const locator = page.locator("li[role='option']", {hasText: targetAddr});
            while (await locator.count() != 1) {
                await page.keyboard.down("ArrowDown");
            }
            await locator.click();
```

## solution 2

```ts
            const scroller = page.locator('ul[role="listbox"] > div');
            const locator = scroller.locator("li[role='option']", {hasText: targetAddr})
            while (await locator.count() != 1) {
                // be careful about this scroll step length
                await scroller.evaluate((div) => div.scrollBy(0, 30));
            }
            await locator.click();
```

## solution 3


```ts
            const scroller = page.locator('ul[role="listbox"] > div');
            await scroller.evaluate(async (div, addr) => {
                while (true) {
                    const it = document.evaluate(`.//span[text()="${addr}"]`, div).iterateNext();
                    if (it != null) {
                        (it as HTMLElement).click()
                        return;
                    }
                    div.scrollBy(0, 10);
                }
            }, targetAddr);
```

Experienced Web programmer will notice the problem in the code above.


```ts
            const scroller = page.locator('ul[role="listbox"] > div');
            await scroller.evaluate(async (div, addr) => {
                while (true) {
                    const it = document.evaluate(`.//span[text()="${addr}"]`, div).iterateNext();
                    if (it != null) {
                        (it as HTMLElement).click()
                        return;
                    }
                    div.scrollBy(0, 10);
                    // given a chance for the scroll event handler of to do its stuff
                    // https://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }, targetAddr);
```