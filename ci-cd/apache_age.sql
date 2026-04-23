CREATE EXTENSION age;
LOAD 'age';
SET search_path TO ag_catalog, public;
SELECT create_graph('graph_name');