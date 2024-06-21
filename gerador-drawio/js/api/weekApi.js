const purchaseOrderApi = [
  {
    "fieldName": "external_id",
    "type": "string",
    "description": "The external identifier (PO number) that the shipper and consignee uses to identify the purchase order.",
    "index": 1000
  },
  {
    "fieldName": "consignee_id",
    "type": "string",
    "description": "The ID of the consignee this purchase order is associated with.",
    "index": 1001
  },
  {
    "fieldName": "week_id",
    "type": "string",
    "description": "The ID of the week that this purchase order pertains to.",
    "index": 1002
  },
  {
    "fieldName": "placed_at",
    "type": "DateTime",
    "description": "The date and time that the consignee created (issued) the purchase order.",
    "index": 1003
  },
  {
    "fieldName": "original_requested_arrival_at",
    "type": "DateTime",
    "description": "The date and time that the consignee requests to receive the purchase order.",
    "index": 1004
  },
  {
    "fieldName": "unit_type",
    "type": "string",
    "nullable": true,
    "description": "The type of packaging units comprised by the purchase order.",
    "index": 1005
  },
  {
    "fieldName": "unit_quantity",
    "type": "integer",
    "nullable": true,
    "description": "The amount packaging units comprised by the purchase order.",
    "index": 1006
  },
  {
    "fieldName": "shipped_quantity",
    "type": "number",
    "format": "float",
    "nullable": true,
    "description": "The amount packaging units that were actually shipped.",
    "index": 1007
  },
  {
    "fieldName": "value",
    "type": "number",
    "nullable": true,
    "description": "The monetary value of the purchase order.",
    "index": 1008
  },
  {
    "fieldName": "value_currency_code",
    "type": "Currency",
    "description": "The currency code of monetary value of the purchase order.",
    "index": 1009
  },
  {
    "fieldName": "linehaul_spend",
    "type": "number",
    "format": "float",
    "nullable": true,
    "description": "Payable base rate sliced by this order.",
    "index": 1010
  },
  {
    "fieldName": "linehaul_spend_currency_code",
    "type": "Currency",
    "description": "Currency code for linehaul_spend.",
    "index": 1011
  },
  {
    "fieldName": "accessorial_value",
    "type": "number",
    "format": "float",
    "nullable": true,
    "description": "Total payable value of all accessorials sliced by this order.",
    "index": 1012
  },
  {
    "fieldName": "accessorial_currency_code",
    "type": "Currency",
    "description": "Currency code for accessorial_value.",
    "index": 1013
  },
  {
    "fieldName": "fuel_surcharge",
    "type": "number",
    "format": "float",
    "nullable": true,
    "description": "Total payable fuel surcharge sliced by this order.",
    "index": 1014
  },
  {
    "fieldName": "fuel_surcharge_currency_code",
    "type": "Currency",
    "description": "Currency code for fuel_surcharge.",
    "index": 1015
  },
  {
    "fieldName": "total_spend",
    "type": "number",
    "format": "float",
    "nullable": true,
    "description": "Total payable rate sliced by this order.",
    "index": 1016
  },
  {
    "fieldName": "total_spend_currency_code",
    "type": "Currency",
    "description": "Currency code for total_spend.",
    "index": 1017
  },
  {
    "fieldName": "confirmed_delivery_date",
    "type": "Date",
    "description": "The confirmed delivery date (CDD) for a purchase order. This is generally set by the shipper, based on what they can commit to.",
    "index": 1018
  },
  {
    "fieldName": "report_id",
    "type": "string",
    "description": "The ID of the report that this purchase order is associated with.",
    "index": 1019
  }
]