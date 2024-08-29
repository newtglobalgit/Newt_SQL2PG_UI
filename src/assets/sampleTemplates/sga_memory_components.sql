spool <<dmap_db_script_output_path>>
--spool C:\Users\dsure\Downloads\Final_new_scripts\sga_memory_components.txt

set trimspool on 
set termout off
set verify off
set trimspool on
set linesize 320
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col name format a32
col bytes format 999,999,999,990.00

set heading off

prompt Script_Start - Information about the system global area (SGA) components in an Oracle Database using the V$SGAINFO view.

set heading off
/* information about the system global area (SGA) components in an Oracle Database using the V$SGAINFO view. */
select name||'NG_DMAP_DELIMITER'||bytes||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
from V$sgainfo
order by bytes desc
;
prompt
prompt Script_End - Information about the system global area (SGA) components in an Oracle Database using the V$SGAINFO view.
prompt

set trimspool on 
set termout off
set verify off
set trimspool on
set linesize 320
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col name format a20
Col value format 999999999990.00


set heading off
prompt Script_Start - Information about the current sizes of various components in the System Global Area (SGA) of an Oracle Database using the V$SGA view.

set heading off
/* information about the system global area (SGA) components in an Oracle Database using the V$SGAINFO view. */
select name||'NG_DMAP_DELIMITER'||value||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
 from V$sga
;
prompt
prompt Script_End - Information about the current sizes of various components in the System Global Area (SGA) of an Oracle Database using the V$SGA view.
prompt

set trimspool on 
set termout off
set verify off
set trimspool on
set linesize 320
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
column owner format a64
column name  format a1000
column type  format a64
column sharable_mem format 999,999,999,9990.00
column executions   format 999,999,999,9990.00

set heading off
prompt Script_Start - Information about sharable memory usage for specific types of database objects (packages, package bodies, functions, and procedures) from the V$DB_OBJECT_CACHE view.
set heading off
/* information about sharable memory usage for specific types of database objects (packages, package bodies, functions, and procedures) from the V$DB_OBJECT_CACHE view */
select  owner||'NG_DMAP_DELIMITER'||name||' - '||type||'NG_DMAP_DELIMITER'||sharable_mem||'NG_DMAP_DELIMITER'||'NG_DMAP_END' from v$db_object_cache
 where sharable_mem > 100000
  and type in ('PACKAGE', 'PACKAGE BODY', 'FUNCTION', 'PROCEDURE')
 order by sharable_mem desc
 ;
prompt
prompt Script_End - Information about sharable memory usage for specific types of database objects (packages, package bodies, functions, and procedures) from the V$DB_OBJECT_CACHE view.
prompt

set trimspool on 
set termout off
set verify off
set trimspool on
set linesize 320
set longchunksize 200000
set long 200000
set pagesize 9500
set wrap on
set feedback off
col name format a32
col value format 999,999,999,990.00


set heading off
prompt Script_Start - Information about PGA (Program Global Area) memory statistics from the V$PGASTAT view.
set heading off
/* information about PGA (Program Global Area) memory statistics from the V$PGASTAT view */
Col Name format a48
select name||'NG_DMAP_DELIMITER'||value/1024/1024||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
 from v$pgastat
 where name in ('total PGA allocated','maximum PGA allocated') 
;
prompt
prompt Script_End - Information about PGA (Program Global Area) memory statistics from the V$PGASTAT view.
prompt

set trimspool on 
set termout off
set verify off
set trimspool on
set linesize 4500
set longchunksize 900000
set long 900000
set pagesize 32000
set wrap on
set feedback off
col name format a80
col value format a4000
set heading off

prompt Script_Start - retrieve information about database parameters that have been explicitly set to values different from their defaults.

set heading off
/*  retrieve information about database parameters that have been explicitly set to values different from their defaults.  */
select  name||'NG_DMAP_DELIMITER'||value||'NG_DMAP_DELIMITER'||'NG_DMAP_END'
from v$parameter
where isdefault = 'FALSE'
and value is not null
order by name
;
prompt
prompt Script_End - retrieve information about database parameters that have been explicitly set to values different from their defaults.

/
spool off
quit;
/