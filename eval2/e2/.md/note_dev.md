creation ticker
POST http://glpi.test/apirest.php/Ticket
{
    input: {
        name:,
        content:,
        type:,
        urgency:,
        impact:,
    }
}
assignation user ticket
POST http://glpi.test/apirest.php/Ticket_User
{
  input: {
    tickets_id:,
    users_id:,
    type:,
  }
}
type 1 : demandeur , type 2 : technicien ,type 3 : observateur