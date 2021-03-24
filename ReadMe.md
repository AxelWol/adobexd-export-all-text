# Overview

Import/Export all text resources of an Adobe XD file

## Description

This is a simple export/import plugin for Adobe XD.
It can export all text resources (visible text) from inside Adobe XD to a CSV file.
The CSV file is ";" - separated.
It can also import a modified CSV file back into Adobe XD.

This is quite helpful for copy writing or translation work.

## Format of CSV file
ArtboardId;ArtboardName;TextId;Text

_Important_:
Only change the last cell "Text". The other cells are needed by the import function.

## Encoding
Some special characters are encoded with this pattern {{ }}:

```
'\r\n'  -->  '{{cr}}{{lf}}');
'\n\r'  -->  '{{cr}}{{lf}}');
'\r',   -->  '{{cr}}');
'\n',   -->  '{{lf}}');
'\t',   -->  '{{tab}}');
'\uee88',   -->  '{{x1}}');
'\uee80',   -->  '{{*}}');
'\x91',   -->  '{{_}}');
'\x87',   -->  '{{x2}}');
'\x00',   -->  '{{nul}}');
'\x01',   -->  '{{soh}}');
'\x02',   -->  '{{stx}}');
'\x03',   -->  '{{etx}}');
'\x04',   -->  '{{eot}}');
'\x05',   -->  '{{enq}}');
'\x06',   -->  '{{ack}}');
'\x07',   -->  '{{bel}}');
'\x08',   -->  '{{bs}}');
'\x09',   -->  '{{tab}}');
'\x0a',   -->  '{{lf}}');
'\x0b',   -->  '{{vt}}');
'\x0c',   -->  '{{ff}}');
'\x0d',   -->  '{{cr}}');
'\x0e',   -->  '{{so}}');
'\x0f',   -->  '{{si}}');
```