# SQL Avancé — Référence

---

## 1. Sous-requêtes (Subqueries)

### 1.1 Sous-requête dans WHERE avec IN

**Clients ayant effectué au moins une commande**
```sql
SELECT *
FROM client
WHERE id_client IN (
    SELECT id_client
    FROM commande
);
```

**Clients n'ayant jamais commandé (NOT IN)**
```sql
SELECT *
FROM client
WHERE id_client NOT IN (
    SELECT id_client
    FROM commande
);
```

**Produits commandés en 2024**
```sql
SELECT *
FROM produit
WHERE id_produit IN (
    SELECT id_produit
    FROM commande
    WHERE YEAR(date_commande) = 2024
);
```

---

### 1.2 Sous-requête scalaire (retourne une seule valeur)

**Produit le plus cher**
```sql
SELECT *
FROM produit
WHERE prix = (
    SELECT MAX(prix)
    FROM produit
);
```

**Employés gagnant plus que la moyenne**
```sql
SELECT nom, salaire
FROM employe
WHERE salaire > (
    SELECT AVG(salaire)
    FROM employe
);
```

**Nombre de commandes par client vs moyenne globale**
```sql
SELECT
    id_client,
    COUNT(*) nb_commandes,
    (SELECT AVG(cnt) FROM (
        SELECT COUNT(*) cnt
        FROM commande
        GROUP BY id_client
    ) t) AS moyenne_globale
FROM commande
GROUP BY id_client;
```

---

### 1.3 Sous-requête dans SELECT (colonne calculée)

**Afficher le total des commandes de chaque client sur la même ligne**
```sql
SELECT
    c.nom,
    c.email,
    (
        SELECT SUM(co.montant)
        FROM commande co
        WHERE co.id_client = c.id_client
    ) AS total_commandes
FROM client c;
```

**Afficher le nombre de commandes par client**
```sql
SELECT
    c.nom,
    (
        SELECT COUNT(*)
        FROM commande co
        WHERE co.id_client = c.id_client
    ) AS nb_commandes
FROM client c;
```

---

### 1.4 Sous-requête dans FROM (table dérivée)

**Top clients avec leur total, filtré après agrégation**
```sql
SELECT *
FROM (
    SELECT
        id_client,
        SUM(montant) AS total
    FROM commande
    GROUP BY id_client
) AS resume
WHERE total > 1000000;
```

**Rang des produits par ventes dans une sous-requête**
```sql
SELECT *
FROM (
    SELECT
        id_produit,
        SUM(quantite) AS total_vendu,
        RANK() OVER(ORDER BY SUM(quantite) DESC) AS rang
    FROM ligne_commande
    GROUP BY id_produit
) AS classement
WHERE rang <= 5;
```

---

### 1.5 Sous-requête corrélée

> La sous-requête fait référence à la requête principale — elle s'exécute **pour chaque ligne**.

**Employés dont le salaire est le plus élevé dans leur département**
```sql
SELECT e1.nom, e1.departement, e1.salaire
FROM employe e1
WHERE e1.salaire = (
    SELECT MAX(e2.salaire)
    FROM employe e2
    WHERE e2.departement = e1.departement
);
```

**Clients dont le montant de leur dernière commande dépasse 500 000**
```sql
SELECT c.nom
FROM client c
WHERE (
    SELECT montant
    FROM commande co
    WHERE co.id_client = c.id_client
    ORDER BY date_commande DESC
    LIMIT 1
) > 500000;
```

---

### 1.6 Sous-requête avec ANY / ALL

**Produits plus chers qu'au moins un produit de la catégorie 'Accessoire'**
```sql
SELECT nom, prix
FROM produit
WHERE prix > ANY (
    SELECT prix
    FROM produit
    WHERE categorie = 'Accessoire'
);
```

**Produits plus chers que tous les produits de la catégorie 'Accessoire'**
```sql
SELECT nom, prix
FROM produit
WHERE prix > ALL (
    SELECT prix
    FROM produit
    WHERE categorie = 'Accessoire'
);
```

---

### 1.7 Sous-requête dans HAVING

**Départements dont le salaire moyen dépasse la moyenne globale**
```sql
SELECT departement, AVG(salaire) AS moy_dept
FROM employe
GROUP BY departement
HAVING AVG(salaire) > (
    SELECT AVG(salaire)
    FROM employe
);
```

**Clients ayant passé plus de commandes que la moyenne**
```sql
SELECT id_client, COUNT(*) AS nb
FROM commande
GROUP BY id_client
HAVING COUNT(*) > (
    SELECT AVG(cnt)
    FROM (
        SELECT COUNT(*) AS cnt
        FROM commande
        GROUP BY id_client
    ) t
);
```

---

### 1.8 Sous-requête dans INSERT / UPDATE / DELETE

**Insérer dans une table archive les commandes anciennes**
```sql
INSERT INTO commande_archive
SELECT *
FROM commande
WHERE date_commande < '2023-01-01';
```

**Mettre à jour le niveau des employés selon leur salaire**
```sql
UPDATE employe
SET niveau = (
    CASE
        WHEN salaire > (SELECT AVG(salaire) FROM employe) THEN 'Senior'
        ELSE 'Junior'
    END
);
```

**Supprimer les clients sans commande**
```sql
DELETE FROM client
WHERE id_client NOT IN (
    SELECT DISTINCT id_client
    FROM commande
);
```

---

## 2. EXISTS

> Plus performant que `IN` dans certains cas.

```sql
SELECT *
FROM client c
WHERE EXISTS (
    SELECT 1
    FROM commande co
    WHERE co.id_client = c.id_client
);
```

Retourne les clients ayant au moins une commande.

---

## 3. CASE WHEN

> Équivalent d'un `if/else`.

```sql
SELECT
    nom,
    salaire,
    CASE
        WHEN salaire > 3000000 THEN 'Senior'
        WHEN salaire > 1000000 THEN 'Intermédiaire'
        ELSE 'Junior'
    END AS niveau
FROM employe;
```

---

## 4. CTE (WITH)

> Très utilisé dans les projets Data Engineering.

```sql
WITH total_client AS (
    SELECT
        id_client,
        SUM(montant) total
    FROM commande
    GROUP BY id_client
)
SELECT *
FROM total_client
WHERE total > 500000;
```

---

## 5. Fenêtres (Window Functions)

> Extrêmement importantes.

### ROW_NUMBER()

```sql
SELECT
    nom,
    salaire,
    ROW_NUMBER() OVER(
        ORDER BY salaire DESC
    ) rang
FROM employe;
```

| nom  | salaire | rang |
|------|---------|------|
| Jean | 5000    | 1    |
| Paul | 4000    | 2    |
| Marc | 3000    | 3    |

### RANK()

> Gère les égalités.

```sql
SELECT
    nom,
    salaire,
    RANK() OVER(
        ORDER BY salaire DESC
    ) rang
FROM employe;
```

### DENSE_RANK()

```sql
SELECT
    nom,
    salaire,
    DENSE_RANK() OVER(
        ORDER BY salaire DESC
    ) rang
FROM employe;
```

---

## 6. PARTITION BY

> Classement par groupe.

```sql
SELECT
    departement,
    nom,
    salaire,
    RANK() OVER(
        PARTITION BY departement
        ORDER BY salaire DESC
    ) rang
FROM employe;
```

**IT :**

| nom  | salaire | rang |
|------|---------|------|
| Jean | 5000    | 1    |
| Marc | 3000    | 2    |

**Finance :**

| nom  | salaire | rang |
|------|---------|------|
| Paul | 6000    | 1    |
| Luc  | 4500    | 2    |

---

## 7. LAG et LEAD

> Comparer avec la ligne précédente ou suivante.

```sql
SELECT
    date_commande,
    montant,
    LAG(montant) OVER(
        ORDER BY date_commande
    ) montant_prec
FROM commande;
```

| date  | montant | précédent |
|-------|---------|-----------|
| 01/01 | 100     | NULL      |
| 02/01 | 150     | 100       |
| 03/01 | 200     | 150       |

---

## 8. Somme cumulée

> Très demandé en Power BI et Data Engineering.

```sql
SELECT
    date_commande,
    montant,
    SUM(montant) OVER(
        ORDER BY date_commande
    ) cumul
FROM commande;
```

| date  | montant | cumul |
|-------|---------|-------|
| 01/01 | 100     | 100   |
| 02/01 | 150     | 250   |
| 03/01 | 200     | 450   |

---

## 9. Recursive CTE

> Pour les hiérarchies.

**Table employé :**

| id | nom     | manager_id |
|----|---------|------------|
| 1  | DG      | NULL       |
| 2  | Chef IT | 1          |
| 3  | Dev1    | 2          |
| 4  | Dev2    | 2          |

```sql
WITH RECURSIVE hierarchy AS (
    SELECT
        id,
        nom,
        manager_id,
        1 niveau
    FROM employe
    WHERE manager_id IS NULL
    UNION ALL
    SELECT
        e.id,
        e.nom,
        e.manager_id,
        h.niveau + 1
    FROM employe e
    JOIN hierarchy h
        ON e.manager_id = h.id
)
SELECT *
FROM hierarchy;
```

---

## 10. Pivot avec CASE

> Transformer des lignes en colonnes.

```sql
SELECT
    id_client,
    SUM(CASE WHEN annee = 2024 THEN montant END) AS vente_2024,
    SUM(CASE WHEN annee = 2025 THEN montant END) AS vente_2025
FROM vente
GROUP BY id_client;
```

---

## 11. Self Join

> Joindre une table à elle-même.

```sql
SELECT
    e.nom employe,
    m.nom manager
FROM employe e
LEFT JOIN employe m
    ON e.manager_id = m.id;
```

---

## 12. Requête de niveau entretien

> Trouver les 3 meilleurs clients par chiffre d'affaires.

```sql
WITH ca_client AS (
    SELECT
        id_client,
        SUM(montant) ca
    FROM commande
    GROUP BY id_client
)
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER(
               ORDER BY ca DESC
           ) rn
    FROM ca_client
) x
WHERE rn <= 3;
```
