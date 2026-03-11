"""
CVFit PDF Tema 2 — Koyu Header Üstte + Iki Sutun (Resim 2)
"""
from reportlab.lib import colors
from reportlab.lib.units import cm

def hex_color(h):
    h=h.lstrip("#"); r,g,b=int(h[0:2],16),int(h[2:4],16),int(h[4:6],16)
    return colors.Color(r/255,g/255,b/255)

def wrap_text(c,text,x,y,max_w,font,size,clr,line_h,min_y=1.2*cm):
    c.setFont(font,size); c.setFillColor(clr)
    words=str(text or "").split(); line=""
    for w in words:
        test=(line+" "+w).strip()
        if c.stringWidth(test,font,size)<=max_w: line=test
        else:
            if line: c.drawString(x,y,line); y-=line_h
            line=w
            if y<min_y: return y
    if line: c.drawString(x,y,line); y-=line_h
    return y


def get_skill_name(sk):
    if isinstance(sk, dict): return sk.get("name", "")
    return str(sk)

def get_skill_level(sk):
    if isinstance(sk, dict): return sk.get("level", 0)
    return 0

def draw_skill_bar(c, x, y, bar_w, level, clr_fill, clr_bg):
    """level 0 ise bar çizme, sadece isim"""
    if not level: return
    c.setFillColor(clr_bg); c.roundRect(x, y-0.1*cm, bar_w, 0.17*cm, 0.06*cm, fill=1, stroke=0)
    fill = min(level/5.0, 1.0)
    c.setFillColor(clr_fill); c.roundRect(x, y-0.1*cm, bar_w*fill, 0.17*cm, 0.06*cm, fill=1, stroke=0)

def draw_skill_dots(c, x, y, level, clr_on, clr_off, r=0.09*cm):
    """level 0 ise dot çizme"""
    if not level: return
    for d in range(5):
        c.setFillColor(clr_on if d < level else clr_off)
        c.circle(x + d*0.3*cm, y+0.07*cm, r, fill=1, stroke=0)

PALETTES={
    "mavi":  {"p":"1A5276","s":"2E86C1","sb":"154360","lt":"AED6F1"},
    "gri":   {"p":"212121","s":"555555","sb":"111111","lt":"CCCCCC"},
    "teal":  {"p":"00695C","s":"00897B","sb":"004D40","lt":"80CBC4"},
    "bordo": {"p":"7B1A1A","s":"C0392B","sb":"5B0E0E","lt":"F1948A"},
    "yesil": {"p":"1E6B3C","s":"27AE60","sb":"145A32","lt":"A9DFBF"},
}

def render(c, cv, page_w, page_h, renk="mavi"):
    pal=PALETTES.get(renk,PALETTES["mavi"])
    P=hex_color(pal["p"]); S=hex_color(pal["s"]); SBG=hex_color(pal["sb"]); LT=hex_color(pal["lt"])
    W=colors.white; TXT=hex_color("222222"); GRY=hex_color("777777")
    HDR_H=4.5*cm; CONTACT_H=1.2*cm

    # Koyu header
    c.setFillColor(SBG); c.rect(0, page_h-HDR_H, page_w, HDR_H, fill=1, stroke=0)
    # Contact bar (bir ton daha acik)
    c.setFillColor(P); c.rect(0, page_h-HDR_H-CONTACT_H, page_w, CONTACT_H, fill=1, stroke=0)
    # Geri kalan beyaz
    c.setFillColor(W); c.rect(0, 0, page_w, page_h-HDR_H-CONTACT_H, fill=1, stroke=0)
    # Alt accent cizgi header altinda
    c.setFillColor(LT); c.rect(0, page_h-HDR_H-0.08*cm, page_w, 0.08*cm, fill=1, stroke=0)

    # Isim
    c.setFont("DJ-B",24); c.setFillColor(W)
    c.drawString(1.2*cm, page_h-2.4*cm, cv.get("name",""))
    c.setFont("DJ",10); c.setFillColor(LT)
    c.drawString(1.2*cm, page_h-3.3*cm, cv.get("title","")[:50])

    # Contact bar icerik
    contact_items = (cv.get("contact") or [])[:4]
    if contact_items:
        total_w = page_w - 2.4*cm
        col_w = total_w / len(contact_items)
        for i, item in enumerate(contact_items):
            cx = 1.2*cm + i * col_w
            c.setFont("DJ",7.5); c.setFillColor(W)
            c.drawString(cx, page_h-HDR_H-CONTACT_H+0.38*cm, str(item)[:35])

    # Iki sutun layout
    MAIN_W = page_w * 0.62
    SIDE_W = page_w * 0.32
    SIDE_X = MAIN_W + 0.6*cm
    rx = 1.0*cm; rw = MAIN_W - 1.4*cm
    top_y = page_h - HDR_H - CONTACT_H - 0.8*cm

    def sec(title, y, x=None, w=None):
        if x is None: x=rx
        if w is None: w=rw
        c.setFont("DJ-B",11); c.setFillColor(P); c.drawString(x, y, title); y-=0.25*cm
        c.setFillColor(hex_color("DDDDDD")); c.rect(x, y, w, 0.04*cm, fill=1, stroke=0)
        return y-0.42*cm

    # SOL SUTUN
    my=top_y
    my=sec("Profil", my)
    if cv.get("summary"): my=wrap_text(c,cv["summary"],rx,my,rw,"DJ",8.5,GRY,0.38*cm)
    my-=0.5*cm
    my=sec("Egitimler", my)
    for edu in (cv.get("education") or [])[:3]:
        if my<18.0*cm: break
        c.setFont("DJ-B",9); c.setFillColor(TXT); c.drawString(rx, my, str(edu.get("degree",""))[:40])
        if edu.get("date"): c.setFont("DJ",8); c.setFillColor(GRY); c.drawRightString(MAIN_W-0.3*cm, my, str(edu["date"]))
        my-=0.38*cm
        if edu.get("school"): c.setFont("DJ",8); c.setFillColor(S); c.drawString(rx, my, str(edu["school"])[:40]); my-=0.45*cm
    my-=0.4*cm
    my=sec("Is Deneyimi", my)
    for exp in (cv.get("experience") or [])[:3]:
        if my<7.0*cm: break
        c.setFont("DJ-B",9.5); c.setFillColor(TXT); c.drawString(rx, my, str(exp.get("title",""))[:40])
        if exp.get("date"): c.setFont("DJ",8); c.setFillColor(GRY); c.drawRightString(MAIN_W-0.3*cm, my, str(exp["date"]))
        my-=0.38*cm
        if exp.get("company"): c.setFont("DJ",8); c.setFillColor(S); c.drawString(rx, my, str(exp["company"])[:40]); my-=0.4*cm
        for b in (exp.get("bullets") or [])[:4]:
            if my<6.5*cm: break
            my=wrap_text(c,"• "+b,rx+0.2*cm,my,rw-0.2*cm,"DJ",8,GRY,0.36*cm)
        my-=0.3*cm
    if cv.get("courses") and my>4.0*cm:
        my=sec("Kurslar", my)
        for cr in (cv.get("courses") or [])[:2]:
            if my<2.5*cm: break
            c.setFont("DJ-B",9); c.setFillColor(TXT); c.drawString(rx, my, str(cr.get("name",""))[:45]); my-=0.38*cm
            prov=str(cr.get("provider",""))
            if cr.get("date"): prov+=" – "+str(cr["date"])
            c.setFont("DJ",8); c.setFillColor(GRY); c.drawString(rx, my, prov[:50]); my-=0.35*cm
            if cr.get("description"): my=wrap_text(c,cr["description"],rx,my,rw,"DJ",8,GRY,0.35*cm)
            my-=0.2*cm
    if my>2.0*cm:
        my=sec("Referanslar", my)
        c.setFillColor(S); c.rect(rx, my+0.05*cm, 0.25*cm, 0.25*cm, fill=1, stroke=0)
        c.setFont("DJ",8.5); c.setFillColor(GRY); c.drawString(rx+0.38*cm, my+0.02*cm, "Talep durumunda referans sunulabilir.")

    # SAG SUTUN
    sw=SIDE_W-0.4*cm
    sy=top_y
    # Ince sol cizgi
    c.setFillColor(hex_color("EEEEEE")); c.rect(SIDE_X-0.3*cm, 2.0*cm, 0.04*cm, top_y-2.0*cm, fill=1, stroke=0)

    def ssec(title, y):
        c.setFont("DJ-B",10); c.setFillColor(P); c.drawString(SIDE_X, y, title); y-=0.25*cm
        c.setFillColor(hex_color("DDDDDD")); c.rect(SIDE_X, y, sw, 0.04*cm, fill=1, stroke=0)
        return y-0.42*cm

    sy=ssec("Beceriler", sy)
    bar_w=sw
    for sk in (cv.get("skills") or [])[:9]:
        if sy<5.0*cm: break
        c.setFont("DJ",8); c.setFillColor(TXT); c.drawString(SIDE_X, sy, get_skill_name(sk)[:26]); sy-=0.28*cm
        draw_skill_bar(c, SIDE_X, sy, bar_w, get_skill_level(sk), S, hex_color("EEEEEE"))
        sy-=0.4*cm
    if cv.get("languages") and sy>3.0*cm:
        sy-=0.3*cm
        sy=ssec("Diller", sy)
        for lang in (cv.get("languages") or [])[:4]:
            if sy<1.5*cm: break
            c.setFont("DJ",8); c.setFillColor(TXT); c.drawString(SIDE_X, sy, get_skill_name(lang)[:20])
            draw_skill_bar(c, SIDE_X, sy, bar_w, get_skill_level(lang), S, hex_color("EEEEEE"))
            sy-=0.42*cm