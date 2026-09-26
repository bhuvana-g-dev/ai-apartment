from typing import Literal, Optional
from pydantic import BaseModel, Field, HttpUrl
from uuid import uuid4


class FreeTierDetails(BaseModel):
    credits: Optional[str] = None
    generation_limit: Optional[str] = None
    daily_limit: Optional[str] = None
    monthly_limit: Optional[str] = None
    has_watermark: Optional[bool] = None
    watermark_details: Optional[str] = None
    feature_restrictions: Optional[str] = None
    api_restrictions: Optional[str] = None
    commercial_use_allowed: Optional[bool] = None


PRICING_TYPES = Literal["Completely Free", "Freemium", "Free Trial", "Paid Only"]


class ToolRecord(BaseModel):
    id: str
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    category_id: str
    website_url: str  # stored as string, validated as URL on write
    pricing_type: PRICING_TYPES
    free_availability: bool
    free_tier_details: Optional[FreeTierDetails] = None
    capabilities: list[str] = Field(default_factory=list, max_length=50)
    input_types: list[str] = Field(default_factory=list, max_length=20)
    output_types: list[str] = Field(default_factory=list, max_length=20)
    watermark_info: Optional[str] = Field(None, max_length=500)
    api_available: bool
    best_use_cases: list[str] = Field(default_factory=list, max_length=20)
    limitations: list[str] = Field(default_factory=list, max_length=20)
    verified_date: str  # YYYY-MM-DD
    active: bool

    model_config = {"populate_by_name": True}


class ToolCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    category_id: str
    website_url: str
    pricing_type: PRICING_TYPES
    free_availability: bool
    free_tier_details: Optional[FreeTierDetails] = None
    capabilities: list[str] = Field(default_factory=list)
    input_types: list[str] = Field(default_factory=list)
    output_types: list[str] = Field(default_factory=list)
    watermark_info: Optional[str] = Field(None, max_length=500)
    api_available: bool
    best_use_cases: list[str] = Field(default_factory=list)
    limitations: list[str] = Field(default_factory=list)
    verified_date: str
    active: bool = True


class ToolUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    category_id: Optional[str] = None
    website_url: Optional[str] = None
    pricing_type: Optional[PRICING_TYPES] = None
    free_availability: Optional[bool] = None
    free_tier_details: Optional[FreeTierDetails] = None
    capabilities: Optional[list[str]] = None
    input_types: Optional[list[str]] = None
    output_types: Optional[list[str]] = None
    watermark_info: Optional[str] = Field(None, max_length=500)
    api_available: Optional[bool] = None
    best_use_cases: Optional[list[str]] = None
    limitations: Optional[list[str]] = None
    verified_date: Optional[str] = None
    active: Optional[bool] = None
