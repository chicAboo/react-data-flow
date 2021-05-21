/**
 * @author ChicAboo
 * @date 2020/12/25 3:38 下午
 */
import { select } from 'd3-selection';
import { IndexProps } from '@/typings';

/**
 *  边的hover效果
 *  @param lineId 边id
 *  @param config 边的属性配置
 *  @param arrow 边上箭头名称
 * */
export function lineHover(
  this: SVGAElement,
  lineId: string,
  { lineColor, lineWidth, circleFill, textFill }: IndexProps,
  arrow: string,
) {
  select(this)
    .select('path')
    .attr('stroke', lineColor)
    .attr('stroke-width', lineWidth)
    .attr('marker-end', `url(#${arrow})`);

  select(this).select('circle').attr('fill', circleFill);
  select(this).select('text').attr('fill', textFill);
}
