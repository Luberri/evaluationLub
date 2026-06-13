TRUNCATE TABLE glpi_items_tickets;
TRUNCATE TABLE glpi_documents_items;
TRUNCATE TABLE glpi_documents;
TRUNCATE TABLE glpi_ticketcosts;
TRUNCATE TABLE glpi_monitors;
TRUNCATE TABLE glpi_phones;
TRUNCATE TABLE glpi_tickets;
DELETE FROM glpi_users WHERE id > 8
x