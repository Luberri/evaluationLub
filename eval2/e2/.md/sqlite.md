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

powershell -ExecutionPolicy Bypass -File D:\evaluationLub\eval2\e2\priorise.ps1


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

-------------------------------------------
Get-ChildItem D:\evaluationLub\eval2 -Recurse -File | Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-90)} |
Sort-Object LastWriteTime -Descending |
Select-Object LastWriteTime, FullName

------------------------------------------
pour ticket 2 : 1 computer,1 Monitor

select sum(cout_super/2)+(select sum(cout_super) from cout where id_ticket_glip=1)+160.45 from cout where id_ticket_glip=2;

pour ticket 1 : 1 computer(misy cout glpi)

select sum(cout_super/2)+(select sum(couT_super) from cout where id_ticket_glip=1)+160.45 from cout where id_ticket_glip=2;