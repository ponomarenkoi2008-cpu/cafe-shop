# Changelog

## - 2026-11-27
### Added
- GET / endpoint with basic cafe information and categories
- GET /api/menu endpoint connected to v_menu_client database view
- POST /api/orders endpoint calling sp_create_order stored procedure
- GET /api/stats endpoint for category sales analytics
- GET /health, GET /about and GET /version service routes

### Changed
- Default server port set to 4000
