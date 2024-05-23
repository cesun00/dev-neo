---
title: "Optical Storage (Disc)"
date: 2024-01-01
lastmod: 2024-05-01
draft: true
---

This article is an overview of optical storage devices,
including their history, their physical specifications, the design idea and its underlying physics rationale,
and the manufacturing techniques in order to implement the design.

<!-- https://upload.wikimedia.org/wikipedia/commons/a/ad/Comparison_CD_DVD_HDDVD_BD.svg
https://www.laesieworks.com/digicom/Storage_CD.html
https://www.clir.org/pubs/reports/pub121/sec3/
https://archive.org/details/compactdischandb0000pohl/page/n9/mode/2up
https://en.wikipedia.org/wiki/Photoresist
https://en.wikipedia.org/wiki/Photolithography -->

## History

https://en.wikipedia.org/wiki/Optical_recording


The development history of disc is a chaotic one. Basically everyone was getting ideas from vinyl disc,
such that their design is and patents doesn't .

The real great leap in this technology is the exploitation of phase cancellation.

The invention of optical disc recording didn't come out of the blue.
Researchers in the 1960s had long been influenced by the design of vinyl and the idea of recording sound by making scratches
on an otherwise flat surface. An optical disc is really the laser-using counterpart of a vinyl.

- In 1958, David Paul Gregg devised an analog optical disc used for video recording.

    The design is 

    The concept of spiral track dates back to David's design. He was thinking about a 1 micrometer track and gap, comparing
    to the modern 500nm track and a 1.6 um 

    Under United States patent law, the term of patent, provided that maintenance fees are paid on time, is 20 years from the filing date of the earliest U.S. or international (PCT) application

- In 1966, James T. Russell filed a patent for storing digital signals on an optical transparent foil that is lit from behind by a high-power halogen lamp. The patent was granted in 1970 and finally [gave away to Sony and Philips](https://archive.seattletimes.com/archive/?date=20041129&slug=cdman29) in the 1980s for the manufacturing of CDs.


    Pieter Kramer
- LaserDisc gains succeed in Japan and Hong Kong, Singapore, and Malaysia.

    Analog video format, Both sides are storage, 
    
    https://en.wikipedia.org/wiki/LaserDisc#/media/File:LaserdiscModulation.png

    Contemporary competing media include VHS (1976, Japan) and Betamax  magnetic cassette video tapes.
- Compact Disc (CD), get its name from a previous product line [Compact Cassette](https://en.wikipedia.org/wiki/Cassette_tape) of Philips, and reflect the fact that CD is much smaller than a LaserDisc.

informative site:
https://dutchaudioclassics.nl/Awards-for-PHilips-Compact-Disc-scientist-Piet-Kramer-Gijs-Bouwhuis-Klaas-Compaan/


## Physical Implementation  

All optical storage device works by emitting a laser beam whose property changes when passing through or being reflected by a surface with TODO.

HUGE amount of material you can find on the Internet misinterpret this.
It is the transition brink of a pit and an edge where the destructive interference happens.
Pits and lands equally reflect laser beam into sensor (it is called the law of reflection). Only at the transition from a pit to a land or land to a pit destructive interference occurs in the reflected laser leading to no or extremely dim beam enters the sensor.  This destructive interference occurs because CDs are made so that the depth difference between a pit and a land is a quarter of wavelength of the laser used.

When the center of the laser spot pass through the transition of a pit and a land, half of the laser traval 
<!-- Both peaks and troughs are 0, where as the transition between both is 1.>? TRUE?  -->

minimum size of the laser spot is proportional to the wavelength of the laser

CIRC and NRZI coding

Essentially a CD works by taking reference to an external synchronzied clock.
This is why - When playing an audio CD, a motor within the CD player spins the disc to a scanning velocity of 1.2–1.4 m/s (constant linear velocity, CLV).

## Industrial Manufacturing CD

First, a master disc is made from a glass, hardened by a nickle-vanadium electroforming coated layer.
Then CDs are made by stamping the master disc onto a plastic.

1. A master disc are fabricated using photolithography.
This process is also known as matstering, and the master disc is sometimes simply called a master.

A materail that will either 

1. A circle glass is cleaned with de-ionized water and hair brushes. 
2. It is then send to a rapid spinner to remove water, then cleanness of the surface will be tested with laser by a surface analyzer.
3. 
4. Electroforming
5. stamping out machine remove excessive material (glass and nickle / vanaidum)

The reflective layer is formed by heating alluminium in an vacuumed chamber.
The vaporization point of metal is low, and easy.
https://www.vacuum-metalizing.com/what-is-vacuum-metalizing/
https://www.inseto.co.uk/resist-coating-methods-ikb-067/
https://www.inseto.co.uk/lithography-basics/
https://www.jdbbs.com/thread-4702483-1-1.html
https://en.wikipedia.org/wiki/Electroforming
    https://en.wikipedia.org/wiki/Electrophoretic_deposition

 

## Specifications

The specifications of various optical disk formats are collectively known as the rainbow books:

| subject      | nickname     | specification index                                             | latest release |
|--------------|--------------|-----------------------------------------------------------------|----------------|
| CD, CD-Text, | the Red Book | IEC 60908 - Audio recording - Compact disc digital audio system | IEC 60908:1999 |
| 

non-circular CD: https://en.wikipedia.org/wiki/Shaped_compact_disc
Shaped Disc: https://en.wikipedia.org/wiki/Shaped_compact_disc
card-shape: DREXLER LASER CARD
    https://commons.wikimedia.org/wiki/File:DREXLER_LASER_CARD-02.jpg


- multiple layers of data on the disc...?
- the method of rotation (Constant linear velocity (CLV), Constant angular velocity (CAV), or zoned-CAV)
- the composition of lands and pits

Both Gregg's and Russell's disc are floppy media read in transparent mode, meaning that a beam of laser comes from 1 side of the transparent disc
and information is read by an laser sensor reading head from the other side.

An optical disc is designed to support one of three recording types: read-only (e.g.: CD and CD-ROM), recordable (write-once, e.g. CD-R), or re-recordable (rewritable, e.g. CD-RW). Write-once optical discs commonly have an organic dye (may also be a (Phthalocyanine) Azo dye, mainly used by Verbatim, or an oxonol dye, used by Fujifilm[4]) recording layer between the substrate and the reflective layer. Rewritable discs typically contain an alloy recording layer composed of a phase change material, most often AgInSbTe, an alloy of silver, indium, antimony, and tellurium.[5] Azo dyes were introduced in 1996 and phthalocyanine only began to see wide use in 2002. The type of dye and the material used on the reflective layer on an optical disc may be determined by shining a light through the disc, as different dye and material combinations have different colors.

Blu-ray Disc recordable discs do not usually use an organic dye recording layer, instead using an inorganic recording layer. Those that do are known as low-to-high (LTH) discs and can be made in existing CD and DVD production lines, but are of lower quality than traditional Blu-ray recordable discs.

polycarbonate is a transparent material with a high ratio for passage of light.
polycarbonate plate is where the data is encoded.

------------
 the height of a bump is around 1/4 of the wavelength of the light used, so the light falls 1/4 out of phase before reflection and another 1/4 wavelength out of phase after reflection. This causes partial cancellation of the laser's reflection from the surface. By measuring the reflected intensity change with a photodiode, a modulated signal is read back from the disc

------------

## Involving Organization

The Optical Storage Technology Association (OSTA) promoted standardized optical storage formats.
ISO: International Organization for Standardization
IEC: International Electrotechnical Commission

ISO and IEC have cooperation on many standard published, indexed as `ISO/IEC XXXXX`.

## Optical stoarge Glossary

Optical discs can be reflective, where the light source and detector are on the same side of the disc, or transmissive, where light shines through the disc to be detected on the other side.

Optical discs can store analog information (e.g. Laserdisc), digital information (e.g. DVD),

Optical discs are usually between 7.6 and 30 cm (3.0 and 11.8 in) in diameter, with 12 cm (4.7 in) being the most common size
so-called program area that contains the data commonly starts 25 millimetres away from the center point

while the track pitch (distance from the center of one track to the center of the next) ranges from 1.6 μm (for CDs) to 320 nm (for Blu-ray discs).

Depending on whether ..., can be divided into 3 categories:
1. read-only (e.g.: CD and CD-ROM)
2. recordable (write-once, e.g. CD-R)
3. re-recordable (rewritable, e.g. CD-RW).

- CD (Compact disc): the physical polycarbonate plastic circle plate, 1.2-millimetre (0.047 in) in thickness, 14–33 grams in weigh.

    CD was co-developed by Philips and Sony to store and play digital audio recordings.
    The first CD was manufactured in August 1982.
    The first commercially available audio CD player, the Sony CDP-101, was released in October 1982

     write-once audio and data storage (CD-R),
      rewritable media (CD-RW),
      Video CD (VCD),
      Super Video CD (SVCD),
      Photo CD, Picture CD, Compact Disc-Interactive (CD-i),
      Enhanced Music CD, and Super Audio CD (SACD) which may have a CD-DA layer.



    - 



- CD-ROM
- DVD (Digital Video Disc or Digital Versatile Disc)

    invented and developed in 1995 and first released on November 1, 1996, in Japan

    - HD DVD (High Density Digital Versatile Disc)
    - 
- VCD (Video CD)

A CD is read by focusing a 780 nm wavelength (near infrared) semiconductor laser through the bottom of the polycarbonate layer. The change in height between pits and lands results in a difference in the way the light is reflected.

## CD - Compact disc

CD data is represented as tiny indentations known as pits, encoded in a spiral track molded into the top of the polycarbonate layer. The areas between pits are known as lands. Each pit is approximately 100 nm deep by 500 nm wide, and varies from 850 nm to 3.5 µm in length.[7] 

The distance between the windings (the pitch) is 1.6 µm (measured center-to-center, not between the edges)

Standard CDs have a diameter of 120 millimetres (4.7 in) and are designed to hold up to 74 minutes of uncompressed stereo digital audio or about 650 MiB (681,574,400 bytes) of data
Capacity is routinely extended to 80 minutes and 700 MiB (734,003,200 bytes) by arranging data more closely on the same-sized disc
(narrower track pitch of 1.5 µm)
(A disc with data packed slightly more densely is tolerated by most players (though some old ones fail).)
Even denser tracks are possible, with semi-standard 90 minute/800 MiB discs having 1.33 µm, and 99 minute/870 MiB having 1.26 µm,[12] but compatibility suffers as density increases

The Mini CD has various diameters ranging from 60 to 80 millimetres (2.4 to 3.1 in); they are sometimes used for CD singles, storing up to 24 minutes of audio, or delivering device drivers.
storing up to 24 minutes of audio, or delivering device drivers.

*A single spiral* track spin from the inner side of a CD to the edge.

## CDROM
On early audio CD players that were released prior to the advent of the CD-ROM, the raw binary data of CD-ROM was played back as noise. To address this problem, the subcode channel Q has a "data" flag in areas of the disc that contain computer data rather than playable audio. The data flag instructs CD players to mute the audio.[12][13]

the depth of the pits is approximately one-quarter to **one-sixth** ?? of the wavelength of the laser light used to read the disc

The Yellow Book, created in 1983,[6][14] defines the specifications for CD-ROMs, standardized
1. in 1988 as the ISO/IEC 10149[1] standard and
2. in 1989 as the ECMA-130[15] standard

Like audio CDs (CD-DA), 1 CD-ROM sector composed of 98 frames, and each frame consists of 33 bytes,
among which 
1. 24 bytes for the user data
2. 8 bytes for error correction, and
3. 1 byte for the subcode

This makes a sector 3234 bytes, among which 2,352 bytes are user data.

The data stored in these sectors corresponds to any type of digital data, not audio samples encoded according to the audio CD specification.
    
A track (a group of sectors) inside a CD-ROM only contains sectors in the same mode, but if multiple tracks are present in a CD-ROM, each track can have its sectors in a different mode from the rest of the tracks. They can also coexist with audio CD tracks, which is the case of mixed mode CDs.

