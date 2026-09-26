from typing import Optional
from pydantic import BaseModel


class CategoryRecord(BaseModel):
    id: str
    name: str
    description: str
    slug: str
    icon: Optional[str] = None
    active: bool
