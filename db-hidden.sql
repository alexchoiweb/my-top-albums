CREATE TABLE test (id serial primary key, data jsonb);

-- select id = 1 from test
SELECT data->1 FROM test;

INSERT INTO test (data) VALUES ('[{"a a": 1}, {"b b ": 2}]');

UPDATE test SET data = ('[{"z": 1}]') WHERE id=1;

DELETE FROM test WHERE id = 1;