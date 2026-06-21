# `Array.reduce` — cheatsheet

---

## Grouper

```js
const tickets = [
  { id: 1, status: 'open',   title: 'Bug login' },
  { id: 2, status: 'closed', title: 'Crash import' },
  { id: 3, status: 'open',   title: 'Erreur 404' },
];

const grouped = tickets.reduce((acc, ticket) => {
  const key = ticket.status;
  if (!acc[key]) acc[key] = [];
  acc[key].push(ticket);
  return acc;
}, {});
```

**Résultat**

```js
{
  open:   [{ id:1, ... }, { id:3, ... }],
  closed: [{ id:2, ... }]
}
```

---

## Compter

Compter les occurrences de chaque valeur — utile pour des stats rapides.

```js
const statuses = ['open', 'closed', 'open', 'pending', 'open'];

const counts = statuses.reduce((acc, s) => {
  acc[s] = (acc[s] ?? 0) + 1;
  return acc;
}, {});
```

**Résultat**

```js
{ open: 3, closed: 1, pending: 1 }
```

---

## Aplatir

Aplatir un tableau de tableaux en un seul tableau (flat).

```js
const pages = [[1,2,3], [4,5], [6,7,8,9]];

const flat = pages.reduce((acc, page) => {
  return acc.concat(page);
  // ou : acc.push(...page); return acc;
}, []);
```

**Résultat**

```js
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```

---

## Dédoublonner

Supprimer les doublons d'un tableau d'objets par clé unique.

```js
const items = [
  { id: 1, name: 'Laptop' },
  { id: 2, name: 'Mouse' },
  { id: 1, name: 'Laptop' }, // doublon
];

const unique = items.reduce((acc, item) => {
  if (!acc.find(i => i.id === item.id)) acc.push(item);
  return acc;
}, []);
```

**Résultat**

```js
[{ id:1, name:'Laptop' }, { id:2, name:'Mouse' }]
```

---

## Stats

Calculer somme, min, max, moyenne en un seul passage.

```js
const prices = [120, 45, 300, 80, 15];

const stats = prices.reduce((acc, val) => ({
  sum:   acc.sum + val,
  min:   Math.min(acc.min, val),
  max:   Math.max(acc.max, val),
  count: acc.count + 1,
}), { sum: 0, min: Infinity, max: -Infinity, count: 0 });

stats.avg = stats.sum / stats.count;
```

**Résultat**

```js
{ sum: 560, min: 15, max: 300, count: 5, avg: 112 }
```

---

## `Object.values` / `Object.keys` / `Object.entries`

```js
const obj = {
  a: 10,
  b: 20,
  c: 30,
};

Object.values(obj)  // → [10, 20, 30]
Object.keys(obj)    // → ['a', 'b', 'c']
Object.entries(obj) // → [['a', 10], ['b', 20], ['c', 30]]
```
---

## `ecrire dans un CSV`
### npm install csv-parse csv-stringify
```js
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

function appendToCSV(filePath, newRow) {
  let rows = []

  // Lire le fichier existant, sinon partir d'un tableau vide
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    if (content.trim()) {
      rows = parse(content, { columns: true, skip_empty_lines: true })
    }
  }

  // Ajouter le nouvel objet
  rows.push(newRow)

  // Réécrire le fichier avec header
  const csv = stringify(rows, { header: true })
  fs.writeFileSync(filePath, csv, 'utf-8')
}

// Utilisation
appendToCSV('file.csv', { nom: 'Alice', age: 30, ville: 'Paris' })
appendToCSV('file.csv', { nom: 'Bob',   age: 25, ville: 'Lyon'  })
```