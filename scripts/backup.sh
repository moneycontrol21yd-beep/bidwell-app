date_var=$(date +%Y%m%d)
file_var=/tmp/brain_backup_$date_var.sql
docker exec bidwell-postgres pg_dump -U bidwell -d brain > $file_var
gzip $file_var
echo Backup: $file_var.gz
