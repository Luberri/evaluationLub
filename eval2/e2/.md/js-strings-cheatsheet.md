# JS Strings — Cheat Sheet

## Caractères spéciaux

| Syntaxe | Résultat |
|---------|----------|
| `\n` | Saut de ligne |
| `\r\n` | Saut de ligne (Windows) |
| `\t` | Tabulation |
| `\\` | Backslash `\` |
| `\'` | Apostrophe `'` |
| `\"` | Guillemet `"` |
| `\0` | Null character |

---

## Template literals

```js
const nom = 'Alice'
const age = 30

`Nom: ${nom}, Age: ${age}`   // interpolation
`ligne 1
ligne 2`                     // multiligne direct
`${2 + 2}`                   // expression → "4"
```

---

## Casse & espaces

```js
str.toUpperCase()    // → "HELLO WORLD"
str.toLowerCase()    // → "hello world"
str.trim()           // retire espaces début + fin
str.trimStart()      // retire espaces début
str.trimEnd()        // retire espaces fin
```

---

## Recherche & vérification

```js
str.includes('World')      // → true/false
str.startsWith('Hello')    // → true/false
str.endsWith('World')      // → true/false
str.indexOf('o')           // → index (ou -1)
```

---

## Remplacement

```js
str.replace('World', 'Bob')      // remplace 1ère occurrence
str.replaceAll('l', 'x')         // remplace toutes les occurrences
str.replace(/monde/g, 'world')   // regex, flag g = toutes occurrences
str.replace(/[aeiou]/g, '*')     // remplace toutes les voyelles
str.replace(/\s+/g, '_')         // remplace espaces par _
```

---

## Découpage

```js
str.split(' ')          // → ["Hello", "World"]
str.slice(0, 5)         // → "Hello"
str.substring(6, 11)    // → "World"
```

---

## Padding & répétition

```js
str.padStart(15, '-')   // → "----Hello World"
str.padEnd(15, '-')     // → "Hello World----"
str.repeat(2)           // → "Hello WorldHello World"
```

---

## Écriture fichier (Node.js)

```js
import fs from 'fs'

fs.writeFileSync('file.txt', 'contenu\n', 'utf-8')   // écrase
fs.appendFileSync('file.txt', 'ajout\n', 'utf-8')    // ajoute à la fin
```

## SORT js
```js
const users = [
  { nom: 'Charlie', age: 25 },
  { nom: 'Alice',   age: 30 },
  { nom: 'Bob',     age: 17 }
]

users.sort((a, b) => a.age - b.age)                    // par âge croissant
users.sort((a, b) => b.age - a.age)                    // par âge décroissant
users.sort((a, b) => a.nom.localeCompare(b.nom))       // par nom A → Z
```