DROP TABLE "user", ticket, train_frequency, seat, carriage, train CASCADE;


SELECT carriage.train, carriage.number, seat.number
FROM seat INNER JOIN carriage 
ON seat."carriageId" = carriage.id
ORDER BY carriage.train, carriage.number, seat.number;