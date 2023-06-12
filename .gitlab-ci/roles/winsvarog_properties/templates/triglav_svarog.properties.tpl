conn.type=JNDI
driver.name={{ db_driver_name }}

conn.string={{ db_connstring }}
user.name={{ db_username }}
user.password={{ db_password }}

conn.dbType={{ db_type }}
conn.defaultSchema={{ db_schema }}


sys.jdbc.batch_size=10
jndi.datasource=java:/comp/env/jdbc/svarog

sys.core.cleanup_time=30
sys.core.is_debug=true
sys.masterRepo=svarog
sys.defaultLocale=en_US
sys.defaultDateFormat=dd/MM/yyyy
sys.defaultTimeFormat=HH:mm:ss
sys.defaultJSDateFormat=d/m/Y
sys.defaultJSTimeFormat=H:i

sys.force_timezone=Europe/Skopje

######################################################################
# GIS specific configuration
######################################################################
sys.gis.default_srid=32638
sys.gis.geom_handler=POSTGIS
sys.gis.grid_size=10
sys.gis.tile_cache=100
#a scale of 1000 specifies millimeter precision. 1 signifies meter precision.
sys.gis.precision_scale=1000
sys.conf.path=conf

sys.gis.allow_boundary_intersect=true
sys.gis.legal_sdi_unit_type=1


filestore.conn.type=DEFAULT
filestore.table=svarog_filestore
filestore.type=FILESYSTEM
filestore.path=/svarog/filestore

custom.jar=./svarog_custom_afsard_dp-1.0_dev.jar
frontend.services_host=https://NAITS-APP02.moa.gov.ge/triglav_rest/
frontend.gui_host=https://NAITS-APP02.moa.gov.ge

mail.from=naits@tibrolabs.com
mail.username=naits@tibrolabs.com
mail.password=Y9qU^WNC
mail.host=sub5.mail.dreamhost.com
mail.smtp.auth=true
mail.smtp.starttls.enable=true
mail.smtp.port=587
mail.format=text/html; charset=UTF-8;


security.crypto_type=hsm
security.hsm_cfg_file=C\:\\SoftHSM\\softhsm_svarog.cfg

print.jrxml_path=C:\\naits_tomcat\\apache-tomcat\\webapps\\triglav_rest\\reports
triglav.plugin_path=C:\\naits_tomcat\\apache-tomcat\\webapps\\triglav_rest\\plugins

public_registry.path=C:\\PublicRegistry
app_block.disable_animal_check=true
naits.reporter_user=REPORTER_USER