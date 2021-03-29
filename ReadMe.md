# Overview

Import/Export all text resources of an Adobe XD file

## Build
Version 1.3.2 (changed 2021/03/29).

## Description

This is a simple export/import plugin for Adobe XD.
It can export all text resources (visible text) from inside Adobe XD to a CSV file.
The CSV file is ";" - separated.
It can also import a modified CSV file back into Adobe XD.

This is quite helpful for copy writing or translation work.

## Installation
Just grab the *.xdx file from the build directory and double click it.
It will automatically installed into Adobe XD.

_Hint_: The ZIP-file is protected with the password "adobexd".

## Format of CSV file
ArtboardId;ArtboardName;TextId;Text

### Example

```
ArtboardId;ArtboardName;TextId;Text
75a0c8e5-792d-455b-8713-42ec99479b7d;Web 1920 – 1;1e8e5cde-0bb2-4749-b802-5b5942a293bb;TEXT-Axel-111 1 - 1
75a0c8e5-792d-455b-8713-42ec99479b7d;Web 1920 – 1;c48a6406-9c8e-472c-8e44-1240b882936d;TEXT-Axel-111 2 - 1
75a0c8e5-792d-455b-8713-42ec99479b7d;Web 1920 – 1;f18f4366-6feb-4f81-ba62-d6b2b8c8320e;TEXT-Axel-111 Group 3A - 1
75a0c8e5-792d-455b-8713-42ec99479b7d;Web 1920 – 1;70f1a5c6-979a-4fba-a383-157d1a3ea1dc;TEXT-Axel-111 Group 3B - 1
75a0c8e5-792d-455b-8713-42ec99479b7d;Web 1920 – 1;4b53f24c-cf37-479c-a3c4-a6e126dbab7c;TEXT-Axel-111 Group 3C - 1
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;418106db-5aaf-44cd-b6a5-b91a5125e01e;TEXT-Axel-111 1 - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;d0482336-34aa-4f38-8592-6ba7067c77e8;TEXT-Axel-111 2 - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;6c3f45c0-40a5-48b2-80e8-9dc2f5f3145d;TEXT-Axel-111 Group 3A - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;bf757d49-bb54-4ab2-8a41-ef8bebb69f92;TEXT-Axel-111 Group 3B - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;bdd1a578-a98a-43ce-9dda-9f1c7333456f;TEXT-Axel-111 Group 3C - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;8e8d7187-a53f-4ad4-99b8-bebf3aa6767e;TEXT-Axel-111 Group 4A - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;514c6438-192f-470b-aeb7-b4990c7fe197;TEXT-Axel-111 Group 4B - 2
f22d0867-3251-4efe-b758-8653012bbbd4;Web 1920 – 2;4e9cb05a-5289-44f8-95ed-6b415735a789;TEXT-Axel-111 Group 4C - 2
00000000-0000-0000-0000-000000000000;No Artboard;12d98eaa-f5ab-4582-a8a6-dbb5d4e7e10f;TEXT-Axel-111 outside
```

_Important_:
Only change the last cell "Text". The other cells are needed by the import function.

## Encoding
Some special characters are encoded with this pattern {{ }}.

```
e.g. LF --> {{10}}
```

## Support and Contact

You can reach me here:

Email: axelwolters@gmail.com

Blog: https://axelwolters.wordpress.com/

Twitter: https://twitter.com/axelwol


## Disclaimer

This is a private project.

While I’m working at Microsoft, this work represents my personal view.
Microsoft can not be made responsible for any content expressed here by myself.
