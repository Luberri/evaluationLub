Voir les tables
.tables

Voir la structure d'une table
PRAGMA table_info(cout);

---------------------debug---------------------
netstat -ano | findstr :3306

cd C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin

.\mysqld --console

-------------------puissance--------------------
cd D:\evaluationLub\eval2\e2

powershell -ExecutionPolicy Bypass -File .\priorise.ps1


-----------------java sql-----------------------
@Query("""
SELECT c FROM Cout c
WHERE c.idTicketGlip = :ticketId
AND c.groupe = (
    SELECT MAX(c2.groupe)
    FROM Cout c2
    WHERE c2.idTicketGlip = :ticketId
)
""")
List<Cout> findLatestGroup(@Param("ticketId") Long ticketId);